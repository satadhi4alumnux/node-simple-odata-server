const ODataServer = require('simple-odata-server')
const Adapter = require('../../node-simple-odata-server-nedb/index')
const express = require('express')
const app = express()
const Datastore = require('nedb')
const db = new Datastore({ inMemoryOnly: true })

const model = {
  namespace: 'jsreport',
  entityTypes: {
    UserType: {
      _id: { type: 'Edm.String', key: true },
      test: { type: 'Edm.String' },
      num: { type: 'Edm.Int32' },
      d: { type: 'Edm.DateTimeOffset' },
      addresses: { type: 'Collection(jsreport.AddressType)' }
    }
  },
  complexTypes: {
    AddressType: {
      street: { type: 'Edm.String' }
    }
  },
  entitySets: {
    users: {
      entityType: 'jsreport.UserType'
    }
  }
}

const odataServer = ODataServer()
  .model(model)
  .adapter(Adapter(function (es, cb) { cb(null, db) }))

app.use("/", function (req, res) {

  req.query
  odataServer.beforeQuery((setName, doc, req, cb) => {
        console.log(setName, doc);
        doc['$skiptoken']= 2;
           cb()
    });
  odataServer.handle(req, res);
});

db.insert({ _id: '1', test: 'a', num: 1, addresses: [{ street: 'a1' }] })
db.insert({ _id: '2', test: 'b', num: 2, addresses: [{ street: 'a2' }] })
db.insert({ _id: '3', test: 'c', num: 3 })
db.insert({ _id: '4', test: 'd', num: 4 })
db.insert({ _id: '5', test: 'e', num: 5 })

app.listen(1337, () => {
  console.log('server running on http://localhost:1337')
})
