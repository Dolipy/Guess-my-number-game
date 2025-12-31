'use strict'
/*
document.querySelector('.guess').textContent = 'Hello World!';
document.querySelector('.again').textContent = 'Hello World!';
document.querySelector('.text').textContent = 'Hello World!';
document.querySelector('.borderframe').value = '30';
document.querySelector('.clue-text').textContent = 'Hello World!';
console.log(document.querySelector('.borderframe').value = '30');*/
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let lives = 20;
let highscore = 0;
let score = 0;

console.log(secretNumber);

document.querySelector('.check').addEventListener('click', function() {

    console.log(document.querySelector('.guessing').textContent = '😎Corect Number!');
    console.log(document.querySelector('.score').textContent = '🎇Score! : 0');
    document.querySelector('.guess').textContent = 'Another guess!😊...';


    let guess = Number(document.querySelector('.borderframe').value);
    console.log(guess, typeof guess);
    if (!guess) {
        document.querySelector('.guessing').textContent = '⛔ No Number!';
    } else if (guess === secretNumber) {
        score = score + 5;
        document.querySelector('.text').textContent = secretNumber;
        document.querySelector('.guessing').textContent = '😎Corect Number!';
        document.querySelector('body').style.backgroundImage = 'Linear-gradient(to top, #ff0000, #ffaa00, #f3fc00, #05ff22 , #00ddfe, #a44fff, #ff00d0)';
        document.querySelector('.guess').style.color = ' #7b00fe';
        document.querySelector('.guess').textContent = 'Guessed it right!!!😍';
        document.querySelector('.score').textContent = `💖Score: ${score}`;
    }
    if (score > highscore) {
        highscore = score;
        document.querySelector('.highscore').textContent = `🎇Highscore: ${score}`;
    } else if (guess != secretNumber) {
        if (lives > 1) {
            if (guess > secretNumber) {
                document.querySelector('.guessing').textContent = '📈Too High!';
                lives--;
                document.querySelector('.lives').textContent = `💔💥lives: ${lives}`;
            } else {
                document.querySelector('.guessing').textContent = '📉Too Low!';
                lives--;
                document.querySelector('.lives').textContent = `💔💥lives: ${lives}`;
            }
        }
    }

});
document.querySelector('#Again').addEventListener('click', function() {

    secretNumber = Math.trunc(Math.random() * 20) + 1;
    document.querySelector('.guess').textContent = 'Guess my number!';
    document.querySelector('.guessing').textContent = '🤔Start guessing...';
    document.querySelector('body').style.backgroundImage = ' linear-gradient(to bottom, #3535ff, #a057e3, #ff7eb3, #ff9c7c, #ffbc3f)';

    document.querySelector('.borderframe').value = '';
    document.querySelector('.text').textContent = '?';
});
document.querySelector('#restart').addEventListener('click', function() {
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    document.querySelector('.guess').textContent = 'Guess my number!';
    document.querySelector('.guessing').textContent = '🤔Start guessing...';
    document.querySelector('body').style.backgroundImage = 'linear-gradient(to bottom, #3535ff, #a057e3, #ff7eb3, #ff9c7c, #ffbc3f)';
    document.querySelector('.borderframe').value = '';
    document.querySelector('.text').textContent = '?';
    document.querySelector('.lives').textContent = '💔💥lives: 20';
    document.querySelector('.score').textContent = '💖Score: 0';
    document.querySelector('.highscore').textContent = '🎇Highscore: 0';
});