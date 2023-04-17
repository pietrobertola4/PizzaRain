"use strict";

const fs = require("fs");
const dispatcher = require("./dispatcher");
const http = require("http");
let header = { "Content-Type": "text/html;charset=utf-8" };
let headerJSON = { "Content-Type": "application/json;charset=utf-8" };
const mongoFunctions = require("./mongoFunctions");
const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";


dispatcher.addListener("GET", "/api/ViewClassifica", function (req, res) {
	mongoFunctions.find("Napoli", "classifica", {}, function (err, data) {
		if (err.codErr == -1) {
			res.writeHead(200, headerJSON);
			res.end(JSON.stringify(data));
		} else
			error(req, res, { code: err.codErr, message: err.message });
	}); 
});

dispatcher.addListener("POST", "/api/insPoint", function (req, res) {
    let query = { user: req["post"]["username"], point:req["post"]["point"]};
    mongoFunctions.insertOne("Napoli", "classifica", query, function (err, data) {
        if (err.codErr == -1) {
            console.log("INSERIMENTO OK");
            res.writeHead(200, headerJSON);
            res.end(JSON.stringify("Inserimento Ok"));
        } else
            error(req, res, { code: err.codErr, message: err.message });
    });
});

function error(req, res, err) {
    res.writeHead(err.code, header);
    res.end(err.message);
}

/* Creazione del server */

http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
}).listen(8888);
dispatcher.showList();
console.log("Server running on port 8888...");