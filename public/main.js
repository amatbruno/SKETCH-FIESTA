
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

    $canvas.addEventListener("mousemove", e => {
        if (e.buttons !== 1) return; {
            socket.emit("hola")

            const { top, left } = $canvas.getBoundingClientRect();
            const y = e.pageY - top
            const x = e.pageX - left

            socket.emit('draw', { x, y })
            drawPoint(x, y)
        }
    })
})()