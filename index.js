const express = require("express")
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require("socket.io")(http);

io.on("connection", function(socket) {
    console.log('user a connected')

    socket.on('draw', (message) => {
        io.emit("draw", message)
    });
});



app.use(express.static('public'));
// app.get("/", (req, res) => res.send("Hello People!"))


http.listen(port, () => console.log(`App is listen on: http://localhost:${port}`))