import * as cors from 'cors';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet

import { MongoClient, ObjectID } from 'mongodb'
import { CONFIG, DEFAULT_BEHAVIOR, INITIAL_USER } from './config/main'
import { DEFAULT_PRICE, DEFAULT_TIME_MAX, DEFAULT_TIME_MIN, DEFAULT_TIMES, DEFAULT_USER_CAR, CONFIG_ID, PERMISSIONS } from './config/constants'
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

MongoClient.connect(CONFIG.database).then((db) => {
  console.log("Conexion a mongo exitosa");
  mdb = db
  //CONFIGURACION 
  db.collection("configuracion").findOne({}).then((r) => {
    if (r == null) {
      db.collection("configuracion").insertOne(DEFAULT_BEHAVIOR).then((r) => {
        console.log(JSON.stringify(r))
        setConfigApp(DEFAULT_BEHAVIOR, r.insertedId)
        let user = INITIAL_USER;
        user.password = `${HmacSHA1(user.password, CONFIG.secret)}`
        db.collection("usuarios").insert(user)
        db.collection("zonas").createIndex({localizacion:"2dsphere"})
      })
    } else {
      let conf: IConfig = r
      setConfigApp(conf, r._id)
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
  })

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
  req.db = mdb
  next()
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


function setConfigApp(conf: IConfig, id: ObjectID) {
  app.set(DEFAULT_PRICE, conf.precio)
  app.set(DEFAULT_USER_CAR, conf.vehiculosUsuario)
  app.set(DEFAULT_TIME_MAX, conf.tiempoMax)
  app.set(DEFAULT_TIME_MIN, conf.tiempoMin)
  app.set(DEFAULT_TIMES, conf.tiempos)
  app.set(CONFIG_ID, id)
}

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