
(function () {
    //CONSTANTS DEFINITION
    const $canvas = document.querySelector(".c1");
    const context = $canvas.getContext('2d');
    const $chatForm = document.querySelector(".chat-form");
    const $chatList = document.querySelector(".mssg-container");
    const $btnClear = document.querySelector(".btn-clear")
    const $randomWord = document.getElementById("rndm-word")
    const $btnGuessed = document.querySelector(".guessed");
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

    //FUNCTION TO GET A RANDOM ELEMENT FROM THE ARRAY
    function getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
    function generateRandomWord() {
        const randomWord = getRandomElement(words);
        $randomWord.textContent = randomWord;
    }
    generateRandomWord()

    //BUTTON FOR CLEAR DRAW
    $btnClear.addEventListener("click", e => {
        e.preventDefault();

        //Here we clear the array with the coordinates of drawing and the canvas
        context.clearRect(0, 0, $canvas.width, $canvas.height);
        dots = [];
        requestAnimationFrame(reDraw);

        //Emit the clear action to the server
        socket.emit('clear')
    });

    //DRAWING SECTION
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

    //CHAT SECTION
    socket.on("chat", ({ message }) => {
        const newMessage = document.createElement('li');
        const nickSpan = document.createElement("span");
        const valueSpan = document.createElement("span");

        // Nick and message separation
        const [currentNick, currentValue] = message.split(': ');

        // Nick style
        nickSpan.textContent = currentNick + ": ";
        nickSpan.style.fontWeight = "bold";
        valueSpan.textContent = currentValue;

        // Add below new message
        newMessage.appendChild(nickSpan);
        newMessage.appendChild(valueSpan);

        // Add the new mssg to the main chat
        $chatList.appendChild(newMessage);
    });

    //SHOW THE MSSG
    $chatForm.addEventListener('submit', e => {
        e.preventDefault()
        const currentValue = document.querySelector('[name=message]').value;
        const currentNick = document.querySelector('[name=nick]').value;

        //If it's null don't send anything
        if (currentValue === '') return;

        socket.emit('chat', { message: `${currentNick}: ${currentValue}` })
    })


    $btnGuessed.addEventListener("click", function () {
        socket.emit('correct', () => {
            alert("The draw has been guessed")
        })
    });
})()