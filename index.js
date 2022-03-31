//palvelimen portti
const PORT = process.env.PORT || 5000;

//otetaan express ja muut työkalut käyttöön
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require('path')

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//aloitussivu
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});

//toinen reitti
app.get("/newmsg", function (req, res) {
  res.sendFile(__dirname + "/newmessage.html");
});

app.post("/newmsg", function (req, res) {
  var data = require("./guests.json");

  //pusketaan lomakkeen tiedot json-tiedostoon
  data.push({
    username: req.body.username,
    country: req.body.country,
    date: new Date(),
    message: req.body.message
  });

  var jsonS = JSON.stringify(data);

  //kirjoitetaan tiedot tiedostoon merkkijonoina
  fs.writeFile("guests.json", jsonS, (err) => {
    if (err) throw err;
    console.log("Message sent");
  });
  res.send("ajax message sent");
});

//kolmas reitti
app.get("/ajaxmsg", function (req, res) {
  res.sendFile(__dirname + "/ajaxmsg.html");
});

app.post("/ajaxmsg", function (req, res) {
  var data = require("./guests.json");

  data.push({
    username: req.body.username,
    country: req.body.country,
    date: new Date(),
    message: req.body.message
  });

  var jsonS = JSON.stringify(data);

  fs.writeFile("guests.json", jsonS, (err) => {
    if (err) throw err;
    console.log("Message sent");
  });
  res.sendFile(__dirname + "/ajaxmsg.html");
});

//guestbook, jossa kaikki viestit
app.get("/guestbook", function (req, res) {
  var data = require("./guests.json");

  //luodaan table, jossa kaikki json-tiedot
  var table =
    '<table border="1" style="text-align:center;border-collapse: collapse;background-color: #96D4D4;width:100%"> ';

  for (var i = 0; i < data.length; i++) {
    table +=
      "<tr>" +
      '<td style="padding: 15px;font-size:20px;font-weight:bold;">' +
      data[i].username +
      "</td>" +
      '<td style="padding: 15px;font-size:20px;font-weight:bold;">' +
      data[i].country +
      "</td>" +
      '<td style="padding: 15px;font-size:20px;font-weight:bold;">' +
      data[i].message +
      "</td>" +
      "</tr>";

    console.log(data[i].username + data[i].country + data[i].message);
  }

  res.send(table);
});

app.listen(PORT, function () {
  console.log("App listening on port 5000");
});
