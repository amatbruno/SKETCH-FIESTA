const express = require("express")
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const points = [];

io.on("connection", function (socket) {
    console.log('user a connected')

    socket.on('draw', (message) => {
        points.push(message)
        io.emit("draw", message)
    });
});


app.use(express.static('public'));

app.get("/points", (req, res) => {
    res.send(points);
})


http.listen(port, () => console.log(`App is listen on: http://localhost:${port}`))