import { Response, Request } from 'express'
import { Collection, ObjectID } from 'mongodb'

//Response Simple
export class ResponseSimple {
    constructor(private success: boolean) { }
}

class ResponseInsertSimple extends ResponseSimple {
    constructor(success: boolean, private id: string) {
        super(true);
    }
}


//insert
export function insertToRes(res: Response, collection: Collection, obj: Object, msgSuccess: (id: ObjectID) => Object, msgFail: () => Object) {
    collection.insertOne(obj).then((r) => {
        res.send(msgSuccess(r.insertedId));
    }, (err) => {
        res.send(msgFail());
    });
}

export function insertToSimpleRes(res: Response, collection: Collection, obj: Object) {
    collection.insertOne(obj).then((r) => {
        res.send(new ResponseInsertSimple(true, `${r.insertedId}`));
    }, (err) => {
        res.send(new ResponseInsertSimple(false, null));
    });

}
//GET ONE
export function getOneToSimpleRes(res: Response, collection: Collection, query: Object, proyection?: Object) {
    collection.findOne(query, proyection).then((doc) => {
        if (doc)
            res.send(doc);
        else
            res.status(404).send(new ResponseSimple(false));
    }, (err) => {
        res.status(404).send(new ResponseSimple(false));
    });
}

export function getOneToFailRes(res: Response, collection: Collection, query: Object, proyection: any, onFinded: (doc: any) => void) {
    collection.findOne(query).then((doc) => {
        if (doc)
            onFinded(doc);
        else
            res.status(404).send(new ResponseSimple(false));
    }, (err) => {
        res.status(404).send(new ResponseSimple(false));
    });
}

export function getOneToRes(res: Response, collection: Collection, query: Object, proyection: Object, msgSuccess: (doc: any) => Object, msgFail?: () => Object) {
    collection.findOne(query, proyection).then((doc) => {
        if (doc)
            res.send(msgSuccess(doc));
        else
            res.status(404).send(new ResponseSimple(false));
    }, (err) => {
        if (msgFail)
            res.send(msgFail());
        else {
            res.status(404).send(new ResponseSimple(false));
        }
    });
}


//GET LIST
export class Query {
    q: any;
    limit: number;
    skip: number;
    sort: Object;
    projection: any;

    constructor(query: any, projection?: any) {
        this.q = query.q ? JSON.parse(query.q) : {};
        this.limit = query.limit ? parseInt(query.limit) : 0;
        this.skip = query.skip ? parseInt(query.skip) : 0;
        this.sort = query.sort ? JSON.parse(query.sort) : null;
        this.projection = projection;
    }
}

export function getListToSimpleRes(res: Response, collection: Collection, query: Query) {
    collection.find(query.q, query.projection)
        .limit(query.limit)
        .skip(query.skip)
        .sort(query.sort)
        .toArray().then((r) => {
            res.send(r);
        }, (err) => {
            res.send([]);
        });
}

export function getListToRes(res: Response, collection: Collection, query: Query, msgSuccess: (doc: any[]) => Object) {
    collection.find(query.q, query.projection)
        .limit(query.limit)
        .skip(query.skip)
        .sort(query.sort)
        .toArray().then((r) => {
            res.send(msgSuccess(r));
        }, (err) => {
            res.send([]);
        });
}

export function getListToFailRes(res: Response, collection: Collection, query: Query, onListed: (doc: any[]) => void) {
    collection.find(query.q, query.projection)
        .limit(query.limit)
        .skip(query.skip)
        .sort(query.sort)
        .toArray().then((r) => {
            onListed(r);
        }, (err) => {
            res.send([]);
        });
}

// UPDATE

export function updateToRes(res: Response, collection: Collection, filter: Object, set: Object, msgSuccess: () => Object, msgFail: () => Object) {
    collection.updateOne(filter, { $set: set }).then((r) => {
        res.send(msgSuccess());
    }, (err) => {
        res.send(msgFail());
    });
}

export function updateToSimpleRes(res: Response, collection: Collection, filter: Object, set: Object, success?: () => void) {
    collection.updateOne(filter, { $set: set }).then((r) => {
        if (success)
            success();
        res.send(new ResponseSimple(true));
    }, (err) => {
        res.send(new ResponseSimple(false));
    });
}

export function updateManyToSimpleRes(res: Response, collection: Collection, filter: Object, set: Object, success?: () => void) {
    collection.updateMany(filter, { $set: set }).then((r) => {
        if (success)
            success()
        res.send(new ResponseSimple(true));
    }, (err) => {
        res.send(new ResponseSimple(false));
    });
}

//DELETE

export function deleteToSimpleRes(res: Response, collection: Collection, id: ObjectID) {
    collection.deleteOne({ _id: id }).then(() => {
        res.send(new ResponseSimple(true));
    }, () => {
        res.send(new ResponseSimple(false));
    });
}

//PULL

export function pullToSimpleRes(res: Response, collection: Collection, id: ObjectID, pull: Object) {
    collection.updateOne({ _id: id }, { $pull: pull }).then(() => {
        res.send(new ResponseSimple(true));
    }, () => {
        res.send(new ResponseSimple(false));
    });

}

export function pullManyToSimpleRes(res: Response, collection: Collection, filter: Object, pull: Object) {
    collection.updateMany(filter, { $pull: pull }).then(() => {
        res.send(new ResponseSimple(true));
    }, () => {
        res.send(new ResponseSimple(false));
    });

}


//PUSH

export function pushToSimpleRes(res: Response, collection: Collection, id: ObjectID, push: Object) {
    collection.updateOne({ _id: id }, { $push: push }).then(result => {
        res.send(new ResponseSimple(true));
    }, () => {
        res.send(new ResponseSimple(false));
    });
};