
(function () {
    const $canvas = document.querySelector(".c1");
    const context = $canvas.getContext('2d');
    const socket = io();

    const drawPoint = (x, y) => {
        context.strokeStyle = "red";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
    }

    socket.on('draw', ({ x, y }) => {
        drawPoint(x, y)
    })

    fetch("/points")
        .then(res => res.json())
        .then(points => points.forEach(({ x, y }) => drawPoint( x, y ))) 
})()