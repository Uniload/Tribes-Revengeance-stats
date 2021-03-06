const express = require("express");
const Events = require("events");

let router = express.Router();
let emitter = new Events();

router.get('/ticker', function (req, res) {
    res.render('ticker');
});

function handleWs(ws, req) {
    function listen(type, data) {
        var wsData = {
            type: type,
            server: data.server._id,
            serverName: data.server.name,
            player: data.player.player
        };

        if (ws && !ws.closed) ws.send(JSON.stringify(wsData));
    }

    function ping() {
        if (ws && !ws.closed) ws.send("PING");
    }

    emitter.addListener("join", listen.bind(null, "join"));
    emitter.addListener("left", listen.bind(null, "left"));
    var interval = setInterval(ping, 30 * 1000);

    ws.on('error', function () {
        ws.closed = true;
        emitter.removeListener("join", listen);
        clearInterval(interval);
    });

    ws.on('close', function () {
        ws.closed = true;
        emitter.removeListener("join", listen);
        clearInterval(interval);
    });

    ping();
}

module.exports = {
    handleWs,
    emitter,
    router
}
