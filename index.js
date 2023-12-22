const express = require("express")
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require("socket.io")(http);
let dots = [];

io.on("connection", function (socket) {
    console.log('user connected');

    socket.on('draw', (message) => {
        dots.push(message);
        socket.broadcast.emit("draw", message);
    });

    socket.on('clear', () => {
        dots = [];
        socket.broadcast.emit('clear');
    });
});


app.use(express.static('public'));

app.get("/points", (req, res) => {
    res.send(dots);
})


http.listen(port, () => console.log(`App is listen on: http://localhost:${port}`))