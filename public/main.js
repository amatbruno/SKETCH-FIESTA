
(function () {
    const $canvas = document.querySelector(".c1");
    const context = $canvas.getContext('2d');
    const $btnClear = document.querySelector(".btn-clear")
    const socket = io();
    let dots = [];

    $btnClear.addEventListener("click", e => {
        e.preventDefault();

        context.clearRect(0, 0, $canvas.width, $canvas.height);
        dots = [];
        requestAnimationFrame(reDraw);

        socket.emit('clear')
    });

    const drawPoint = (x, y, clicked) => {
        dots.push({ x, y, clicked })
    }

    const reDraw = (x, y) => {
        context.clearRect(x, y, $canvas.width, $canvas.height);
        if (dots.length < 2) return requestAnimationFrame(reDraw);


        dots.forEach(({ x, y, clicked }, index) => {
            if (!clicked || !index) return;
            const { x: previousX, y: previousY } = dots[index - 1]
            context.strokeStyle = 'black';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(previousX, previousY);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        })
        requestAnimationFrame(reDraw)
    }

    requestAnimationFrame(reDraw)

    $canvas.addEventListener("mousemove", e => {
        const { top, left } = $canvas.getBoundingClientRect();
        const y = e.pageY - top
        const x = e.pageX - left
        const clicked = e.buttons === 1;

        socket.emit('draw', { x, y, clicked })
        drawPoint(x, y, clicked)

        socket.on('clear', () => {
            context.clearRect(0, 0, $canvas.width, $canvas.height);
            dots = [];
            requestAnimationFrame(reDraw);
        });
    })
})()