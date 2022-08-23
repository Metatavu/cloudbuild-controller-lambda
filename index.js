const express = require('express');
const addBuildTrigger = require("./add-cloudbuild-trigger-myownjs.js");


var app = express();
app.use('/', addBuildTrigger);

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});

exports.app = app;
