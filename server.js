const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require("./middleware/is-auth");
const uploadController = require("./controllers/upload");
const GridFSClass = require('./models/singletonGridFS');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const uri = `mongodb+srv://khangse616:khangse616@cluster0-wpib7.mongodb.net/fashion-shop?retryWrites=true&w=majority`;
var gfs;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false,});
mongoose.connection.once("open", ()=>{
    const gfs = GridFSClass.getInstance();
    console.log("connected to database");
});

app.use(isAuth);

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
    const file = gfs
      .find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist"
          });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      });
  });
  
  // @route POST /upload
  // @desc  Uploads file to DB
  app.post('/upload', uploadController.uploadFiles);
  
  app.post("/files/del/:id", (req, res) => {
    gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
      if (err) return res.status(404).json({ err: err.message });
      res.redirect("/");
    });
  });

var port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`now listening for request on port http://localhost:${port}/graphql`);
});
