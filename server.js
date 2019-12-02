const Express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const resize = require('./resize');

var app = Express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", function(req, res) {
     res.sendFile(__dirname + "/index.html");
});

app.post("/api/Upload", function(req, res) {
    const widthString = req.body.width;
    const heightString = req.body.height;
    const format = req.body.format;
    const imageData = req.body.imageData;
    const imageName = req.body.fileName;
    let base64String = imageData; 
    
     // Parse to integer if possible
  let width, height;
  if (widthString) {
    width = parseInt(widthString)
  }
  if (heightString) {
    height = parseInt(heightString)
  }
  // Set the content-type of the response
  res.type(`image/${format || 'png'}`)

    // Remove header
    let base64Image = base64String.split(';base64,').pop();

    let inputFileName = 'Images/' + imageName + "_" + Date.now() + "." + format;
    fs.writeFile(inputFileName, base64Image, {encoding: 'base64'}, function(err) {
        console.log('File created');
        resize(inputFileName, format, width).pipe(res)
        fs.unlinkSync(inputFileName);     
    });
    
    
});

app.listen(port, function(a) {
    console.log("Listening to port 80");
});