var socket = io("http://localhost:8080")

socket.on("server-update-data", function (data) {

    // Home page
    $("#currentTemp").html(data.temp)
    $("#currentHumi").html(data.humi)
    $("#currentLight").html(data.light)

    // Warning mode
    var warningSection = document.getElementById("warningSection")
    if (data.temp > 40 || data.humi < 60) {
        warningSection.classList.add("warning-mode-on")
    } else {
        warningSection.classList.remove("warning-mode-on")
    }

    //History page
    $("#id-content").append("<div class='h-para'>" + data.id + "</div>")
    $("#time-content").append("<div class='h-para'>" + data.time + "</div>")
    $("#temp-content").append("<div class='h-para'>" + data.temp + "</div>")
    $("#humi-content").append("<div class='h-para'>" + data.humi + "</div>")
    $("#light-content").append("<div class='h-para'>" + data.light + "</div>")
})

socket.on("send-full", function (data) {

    // History page
    $("#time-content").html("")
    $("#temp-content").html("")
    $("#humi-content").html("")
    $("#light-content").html("")
    $("#id-content").html("")
    console.log(data)
    data.forEach(function (item) {
        $("#time-content").append("<div class='h-para'>" + item.time + "</div>")
        $("#temp-content").append("<div class='h-para'>" + item.temp + "</div>")
        $("#humi-content").append("<div class='h-para'>" + item.humi + "</div>")
        $("#light-content").append("<div class='h-para'>" + item.light + "</div>")
        $("#id-content").append("<div class='h-para'>" + item.id + "</div>")
    })
})

// ---- Control devices ----
function livingroomLight() {
    var checkBox = document.getElementById("livingroomLight");
    var A1 = document.getElementById("livingrom-light")
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("livingroomLightChange", "on")
        A1.classList.add('turn-on')
    } else {
        // alert('LED Off')
        socket.emit("livingroomLightChange", "off")
        A1.classList.remove('turn-on')
    }
}

function livingroomAirConditioner() {
    var checkBox = document.getElementById("livingroomAirConditioner");
    var A2 = document.getElementById("livingroom-air-conditioner")
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("livingroomAirConditionerChange", "on")
        A2.classList.add('turn-on')
    } else {
        // alert('LED Off')
        socket.emit("livingroomAirConditionerChange", "off")
        A2.classList.remove('turn-on')
    }
}
function television() {
    var checkBox = document.getElementById("television");
    var A3 = document.getElementById("television-container")
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("televisionChange", "on")
        A3.classList.add('turn-on')
    } else {
        // alert('LED Off')
        socket.emit("televisionChange", "off")
        A3.classList.remove('turn-on')
    }
}
function bedroomLight() {
    var checkBox = document.getElementById("bedroomLight");
    var A4 = document.getElementById("bedroom-light")
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("bedroomLightChange", "on")
        A4.classList.add('turn-on')
    } else {
        // alert('LED Off')
        socket.emit("bedroomLightChange", "off")
        A4.classList.remove('turn-on')
    }
}

function bedroomAirConditioner() {
    var checkBox = document.getElementById("bedroomAirConditioner");
    var A5 = document.getElementById("bedroom-air-conditioner")
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("bedroomAirConditionerChange", "on")
        A5.classList.add('turn-on')
    } else {
        // alert('LED Off')
        socket.emit("bedroomAirConditionerChange", "off")
        A5.classList.remove('turn-on')
    }
}

function airVent() {
    var checkBox = document.getElementById("airVent");
    var A6 = document.getElementById("bedroom-vent")
    if (checkBox.checked == true) {
        //alert('LED On')
        socket.emit("airVentChange", "on")
        A6.classList.add('turn-on')
    } else {
        // alert('LED Off')
        socket.emit("airVentChange", "off")
        A6.classList.remove('turn-on')
    }
}

// ---- RTC ----



