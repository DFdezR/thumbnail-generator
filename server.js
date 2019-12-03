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
    var response = {"thumbnails":[]};
    var allItemsSize = req.body.items.length;
    for(var key = 0;key < allItemsSize; key++ ) {
        var thumbnail = {}; 
        let item = req.body.items[key];

        const widthString = item.width;
        const format = item.format;
        const imageData = item.imageData;
        const imageName = item.fileName;
        const parentId = item.parentId;

        // Parse to integer if possible
        let width, height;
        if (widthString) {
            width = parseInt(widthString)
        }
        
        // Remove header
        let base64Image = imageData.split(';base64,').pop();

        let inputFileName = 'Images/' + imageName + "_" + Date.now() + "." + format;
        let outputFileName = 'Images/' + imageName + "_" + Date.now() + "_thumb.jpg";

        fs.writeFile(inputFileName, base64Image, {encoding: 'base64'}, function(err) {
            sharp(inputFileName)
            .resize({ width: width })
            .toFormat('jpg')
            .toFile(outputFileName)
            .then(data => {
                thumbnail["ImageName"] = "data:image/jpg;base64," + fs.readFileSync(outputFileName, 'base64');
                thumbnail["parentId"] = parentId;
                response["items"].push(thumbnail);
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