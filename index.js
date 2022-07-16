// Gõ lệnh node index.js để bắt đầu chạy server

var express = require('express')  // Module xử lí chung
var mysql = require('mysql2')     // Module cho phép sử dụng cơ sở dữ liệu mySQL 
var mqtt = require('mqtt')        // Module cho phép sử dụng giao thức mqtt

var app = express()
var port = 8080                   // Port của localhost do mình chọn

var exportCharts = require('./export.js') // Require file export.js

app.use(express.static("public"))
app.set("views engine", "ejs")
app.set("views", "./views")

var server = require("http").Server(app)
var io = require('socket.io')(server)

app.get('/', function (req, res) {
    res.render('home.ejs')
})

app.get('/history', function (req, res) {
    res.render('history.ejs')
})

server.listen(port, function () {
    console.log('Server listening on port ' + port)
})

//----------------------MQTT-------------------------
//var options = {
    //host: 'test.mosquitto.org',
    //port: 8080,
    //protocol: 'mqtts',
    //username: 'tiennhatkill',
    //password: 'Nhat2000',
    //clientId: 'ESP8266_Nhat'
//}

// initialize the MQTT client
var client = mqtt.connect('mqtt://192.168.1.26:1883');// { clientId: "ESP8266_Nhat" });

// declare topics
var topic1 = "livingroomLight";
var topic2 = "livingroomAirConditioner";
var topic3 = "television";
var topic4 = "bedroomLight";
var topic5 = "bedroomAirConditioner";
var topic6 = "airVent";

var topic_list = ["home/sensors/temperature-humidity"];

console.log("connected flag  " + client.connected);
client.on("connect", function () {
    console.log("connected mqtt " + client.connected);
});

client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

client.subscribe("home/sensors/temperature-humidity");

// SQL--------Temporarily use PHPMyAdmin------------------------------
var con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Nhat@2000',
    database: 'Nhat_database'
});

//---------------------------------------------CREATE TABLE-------------------------------------------------
con.connect(function (err) {
    if (err) throw err;
    console.log("mysql connected");
    var sql = "CREATE TABLE IF NOT EXISTS sensors11(ID int(10) not null primary key auto_increment, Time datetime not null, Temperature int(3) not null, Humidity int(3) not null, Light int(5) not null )"
    con.query(sql, function (err) {
        if (err)
            throw err;
        console.log("Table created");
    });
})

var humi_graph = [];
var temp_graph = [];
var date_graph = [];

var m_time
var newTemp
var newHumi
var newLight

//--------------------------------------------------------------------
var cnt_check = 0;
client.on('message', function (topic, message, packet) {
    console.log("message is " + message)
    console.log("topic is " + topic)
    const objData = JSON.parse(message)
    if (topic == topic_list[0]) {
        cnt_check = cnt_check + 1
        newTemp  = objData.Temperature;
        newHumi  = objData.Humidity;
        newLight = objData.Light;
    }

    if (cnt_check == 1) {
        cnt_check = 0

        console.log("ready to save")
        var n = new Date()
        var month = n.getMonth() + 1
        var Date_and_Time = n.getFullYear() + "-" + month + "-" + n.getDate() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds();

        var sql = "INSERT INTO sensors11 (Time, Temperature, Humidity, Light) VALUES ('" + Date_and_Time.toString() + "', '" + newTemp + "', '" + newHumi + "', '" + newLight + "')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table inserted");
            console.log(Date_and_Time + " " + newTemp + " " + newHumi + " " + newLight)
        });

        var sql = "DELETE FROM sensors11 WHERE humidity >'100' or temperature >= '100' ";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);
        });

        exportCharts(con, io)
    }
})
//----Socket---------Control devices----------------------------

io.on('connection', function (socket) {
    console.log(socket.id + " connected")
    socket.on('disconnect', function () {
        console.log(socket.id + " disconnected")
    })

    socket.on("livingroomLightChange", function (data) {
        if (data == "on") {
            console.log('Livingroom light ON')
            client.publish(topic1, 'livingroomLightOn');
        }
        else {
            console.log('Livingroom light OFF')
            client.publish(topic1, 'livingroomLightOff');
        }
    })

    socket.on("livingroomAirConditionerChange", function (data) {
        if (data == "on") {
            console.log('Livingroom air conditioner ON')
            client.publish(topic2, 'livingroomAirConditionerOn');
        }
        else {
            console.log('Livingroom air conditioner OFF')
            client.publish(topic2, 'livingroomAirConditionerOff');
        }
    })

    socket.on("televisionChange", function (data) {
        if (data == "on") {
            console.log('Television ON')
            client.publish(topic3, 'televisionOn');
        }
        else {
            console.log('Television OFF')
            client.publish(topic3, 'televisionOff');
        }
    })

    socket.on("bedroomLightChange", function (data) {
        if (data == "on") {
            console.log('Bedroom light ON')
            client.publish(topic4, 'bedroomLightOn');
        }
        else {
            console.log('Bedroom light OFF')
            client.publish(topic4, 'bedroomLightOff');
        }
    })

    socket.on("bedroomAirConditionerChange", function (data) {
        if (data == "on") {
            console.log('Bedroom air conditioner ON')
            client.publish(topic5, 'bedroomAirConditionerOn');
        }
        else {
            console.log('Bedroom air conditioner  OFF')
            client.publish(topic5, 'bedroomAirConditionerOff');
        }
    })

    socket.on("airVentChange", function (data) {
        if (data == "on") {
            console.log('Air vent ON')
            client.publish(topic6, 'airVentOn');
        }
        else {
            console.log('Air vent OFF')
            client.publish(topic6, 'airVentOff');
        }
    })

    // Send data to History page
    var sql1 = "SELECT * FROM sensors11 ORDER BY ID DESC"
    con.query(sql1, function (err, result, fields) {
        if (err) throw err;
        console.log("Full Data selected");
        var fullData = []
        result.forEach(function (value) {
            var m_time = value.Time.toString().slice(4, 24);
            fullData.push({ id: value.ID, time: m_time, temp: value.Temperature, humi: value.Humidity, light: value.Light })
        })
        io.sockets.emit('send-full', fullData)
    })
})
