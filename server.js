const Express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp')


var app = Express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.get("/", function(req, res) {
     res.sendFile(__dirname + "/index.html");
});

app.post("/api/upload", function(req, res) {
    res.type('application/json');
    var response = {};
    var allItemsSize = req.body.items.length;
    for(var key = 0;key < allItemsSize; key++ ) {
        let item = req.body.items[key];

        const widthString = item.width;
        const heightString = item.height;
        const format = item.format;
        const imageData = item.imageData;
        const imageName = item.fileName;
        const parentId = item.parentId;

        // Parse to integer if possible
        let width, height;
        if (widthString) {
            width = parseInt(widthString)
        }
        if (heightString) {
            height = parseInt(heightString)
        }
        // Set the content-type of the response

        // Remove header
        let base64Image = imageData.split(';base64,').pop();

        let inputFileName = 'Images/' + imageName + "_" + Date.now() + "." + format;
        let outputFileName = 'Images/' + imageName + "_" + Date.now() + "_thumb." + format;

        fs.writeFile(inputFileName, base64Image, {encoding: 'base64'}, function(err) {
            sharp(inputFileName)
            .resize({ width: width })
            .toFile(outputFileName)
            .then(data => {
                response[parentId] = "data:image/" + format + ";base64," + fs.readFileSync(outputFileName, 'base64');
                //All images has been created
                if(Object.keys(response).length === allItemsSize) {
                    res.status(200).json(response).end();
                }
            });
        });
    }
    console.log('complete');
});

app.listen(port, function(a) {
    console.log("Listening to port " + port);
});