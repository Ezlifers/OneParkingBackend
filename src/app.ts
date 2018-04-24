import { USERS } from './routes/users/api';
import { AUXS } from './routes/auxs/api';
import { ZONES } from './routes/zones/api';
import * as cors from 'cors';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet

import { MongoClient, ObjectID } from 'mongodb'
import { createClient } from 'redis'
import { CONFIG, DEFAULT_BEHAVIOR, INITIAL_USER } from './config/main'
import { AUX, CONFIG_DEFAULTS, CONFIG_ID, DATA_VERSION, PERMISSIONS } from './config/constants';
import { IConfig } from './routes/config/models/_index'
import { ResourcePermisions } from './middlewares/validate_permission'
import { HmacSHA1 } from 'crypto-js'

import users from './routes/users/api'
import clients from './routes/clients/api'
import auxs from './routes/auxs/api'
import supervisors from './routes/supervisors/api'
import zones from './routes/zones/api'
import incidents from './routes/incidents/api'
import reserves from './routes/reserves/api'
import transactions from './routes/transactions/api'
import config from './routes/config/api'

const app: express.Express = express();
var mdb;

let clientRedis = createClient();


MongoClient.connect(CONFIG.database).then((db) => {
  console.log("Conexion a mongo exitosa");
  mdb = db
  //CONFIGURACION 
  
  db.collection("configuracion").findOne({}).then((result) => {
    let version = 0;
    if (result == null) {
      db.collection("configuracion").insertOne(DEFAULT_BEHAVIOR).then((r) => {
        clientRedis.set(CONFIG_DEFAULTS, JSON.stringify(DEFAULT_BEHAVIOR));
        clientRedis.set(CONFIG_ID, "" + r.insertedId);

        let user = INITIAL_USER;
        user.password = `${HmacSHA1(user.password, CONFIG.secret)}`
        db.collection(USERS).insert(user)
        db.collection(ZONES).createIndex({ localizacion: "2dsphere" })
      })
    } else {
      let conf: IConfig = result;
      clientRedis.set(CONFIG_DEFAULTS, JSON.stringify(conf));
      clientRedis.set(CONFIG_ID, ""+result._id);
      version = conf.version;

      //VERSION
      db.collection(ZONES).findOne({ $query: {}, $orderby: { version: -1 } }).then(zone => {
        if (zone != null) {
          version = version >= zone.version ? version : zone.version;
        }
        clientRedis.set(DATA_VERSION, "" + version);
      })

    }

  })
  //PERMISOS
  db.collection("permisos").findOne({}).then((r) => {
    if (r != null && CONFIG.permissionVersion == r.version) {
      app.set(PERMISSIONS, r.permissions)
    } else {
      let permissions = getPermissions([
        users.permissions,
        clients.permissions,
        auxs.permissions,
        supervisors.permissions,
        zones.permissions,
        incidents.permissions,
        reserves.permissions,
        transactions.permissions,
        config.permissions
      ])
      app.set(PERMISSIONS, permissions)
      db.collection("permisos").insertOne({ version: CONFIG.permissionVersion, permissions: permissions })
    }
  });

  //CACHE
  //auxs
  /*db.collection(USERS).find({ tipo: AUX }).toArray().then((r) => {
      for(let user of r){
        clientRedis.set(`Auxs:${user._id}`, JSON.stringify(user));        
      }
  });
  //zones
  db.collection(ZONES).find().toArray().then((r) => {
    for(let zone of r){
        clientRedis.set(`Zones:${zone._id}`, JSON.stringify(zone));        
      }
  });*/

}, (err) => {
  console.log("ERROR al conectarse en mongo : " + err)
})

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req: any, res, next) => {
  req.db = mdb;
  req.redis = clientRedis;
  next();
})

app.use('/api/usuarios', users.api)
app.use('/api/clientes', clients.api)
app.use('/api/auxiliares', auxs.api)
app.use('/api/supervisores', supervisors.api)
app.use('/api/zonas', zones.api)
app.use('/api/incidencias', incidents.api)
app.use('/api/reservas', reserves.api)
app.use('/api/transacciones', transactions.api)
app.use('/api/configuracion', config.api)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use((error: any, req, res, next) => {
    res.status(error['status'] || 500);
    res.render('error', {
      message: error.message,
      error
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((error: any, req, res, next) => {
  res.status(error['status'] || 500);
  res.render('error', {
    message: error.message,
    error: {}
  });
  return null;
});

function getPermissions(resourcePermissions: ResourcePermisions[]) {

  let perms: any = {}

  for (let perm of resourcePermissions) {
    let permissions = perm.permissions
    for (let role in permissions) {
      if (perms[role] == undefined)
        perms[role] = {}
      perms[role][perm.resource] = permissions[role]
    }
  }
  return perms
}

export default app;