export function selectCollection(collection: string, resource?: string) {
    return function (req, res, next) {
        req.resourceName = resource ? resource : collection;
        req.collection = req.db.collection(collection)
        next()
    }
}  