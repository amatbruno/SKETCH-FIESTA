document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.querySelector('.snow-container');

    for (let i = 0; i < 60; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = `${Math.random() * 100}vw`; // Posición horizontal aleatoria
        snowflake.style.animationDuration = `${Math.random() * 3 + 3.5}s`; // Duración de la animación aleatoria
        snowContainer.appendChild(snowflake);
    }
});