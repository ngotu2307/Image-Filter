import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {
  const app = express();
  const port = process.env.PORT || 8082;
  app.use(bodyParser.json());

  app.get("/filteredimage", async ( req, res) => {
    let { image_url } = req.query;

    // 1. validate image_url
    if (!image_url) {
      res.status(400).send("The imageURL is empty");
    }

    // 2. filter image
    filterImageFromURL(image_url)
    .then((localPath) => {
      console.log("localPath: " + localPath);
      // 3 + 4. sendFile in the response & delete
      res.sendFile(localPath, () => {
        deleteLocalFiles([localPath]);
      });
    })
    .catch(error => {
        console.log("error: " + error);
        res.status(400).send("Error: " + error);
    })
  })
  
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();