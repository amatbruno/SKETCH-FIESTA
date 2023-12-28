
(function () {
    const $canvas = document.querySelector(".c1");
    const context = $canvas.getContext('2d');
    const $chatForm = document.querySelector(".chat-form");
    const $chatList = document.querySelector(".mssg-container");
    const $btnClear = document.querySelector(".btn-clear")
    const $randomWord = document.getElementById("rndm-word")
    const socket = io();
    let dots = [];
    const words = [
        "Flower", "Sun", "Moon", "Star", "House", "Tree", "Cloud", "Fish", "Cat", "Dog",
        "Butterfly", "Heart", "Car", "Plane", "Boat", "Apple", "Bird", "Frog", "Hat", "Cup",
        "Clock", "Smiley Face", "Eye", "Ice Cream", "Clown", "Bicycle", "Balloon", "Dolphin",
        "Turtle", "Bee", "House", "Mountain", "Spider", "Train", "Plant", "Robot", "Penguin",
        "Elephant", "Dragon", "Starfish", "Guitar", "Lightning", "Mushroom", "Train", "Globe",
        "Snowflake"
    ];

    function getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
    function generateRandomWord() {
        const randomWord = getRandomElement(words);
        $randomWord.textContent = randomWord;
    }
    generateRandomWord()


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

    socket.on("chat", ({ message }) => {
        const newMessage = document.createElement('li');

        const nickSpan = document.createElement("span");
        const valueSpan = document.createElement("span");

        // Separar el mensaje en currentNick y currentValue
        const [currentNick, currentValue] = message.split(': ');

        // Establecer el contenido y estilos para el currentNick y el currentValue
        nickSpan.textContent = currentNick + ": ";
        nickSpan.style.fontWeight = "bold";
        valueSpan.textContent = currentValue;

        // Agregar los elementos span al nuevo mensaje
        newMessage.appendChild(nickSpan);
        newMessage.appendChild(valueSpan);

        // Agregar el nuevo mensaje al contenedor de mensajes
        $chatList.appendChild(newMessage);
    });

    $chatForm.addEventListener('submit', e => {
        e.preventDefault()
        const currentValue = document.querySelector('[name=message]').value;
        const currentNick = document.querySelector('[name=nick]').value;

        if (currentValue === '') return;

        socket.emit('chat', { message: `${currentNick}: ${currentValue}` })
    })
})()