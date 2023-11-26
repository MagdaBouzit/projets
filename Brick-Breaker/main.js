document.addEventListener('DOMContentLoaded', () => {
    // VARIABLES -------------------------------------------------------------------------
    let canvasDOM = document.querySelector('#canvas');
    let animation;
    const ctx = canvasDOM.getContext("2d"); // Peuvent être mis dans game

    const game = {
        width: 500,
        height: 500,
        color: 'lightgray',
        gameOver: false,
        start: false,
        pause: false
    }

    const ball = {

        X: game.width / 2,
        Y: game.height / 2,
        color: 'white',
        r: 5,
        direction: {
            X: 0, //(-1 gauche, 1 droite, 0 stop)
            Y: 1 // 1 vers le bas, -1 vers le haut
        },
        speed: 5

    }

    const paddle = {
        X: game.width / 2 - 25,
        Y: game.height - 50,
        speed: 10,
        color: 'lightgray',
        width: 50,
        height: 10,
        direction: 0 //(-1 gauche, 1 droite, 0 stop)

    }

    const brick = {
        color: 'orange',
        width: 60,
        height: 20,
        line1: {
            Y: 50,
            X: [50, 120, 190, 260, 330, 400],
            display: [true, true, true, true, true, true]
        },
        line2: {
            Y: 80,
            X: [30, 100, 170, 240, 310, 380],
            display: [true, true, true, true, true, true]
        },
        line3: {
            Y: 110,
            X: [50, 120, 190, 260, 330, 400],
            display: [true, true, true, true, true, true]
        },
        broken: []
    }

    //CANVAS GAME
    canvasDOM.setAttribute('width', game.width);
    canvasDOM.setAttribute('height', game.height);
    //canvasDOM.style.backgroundColor = game.color;

    //BACKGROUND IMAGE
    let image = document.getElementById('background');
    image.addEventListener('load', function () {
        ctx.drawImage(image, 0, 0, game.width, game.height);


        // CANVAS BALL
        ctx.beginPath();
        ctx.arc(ball.X, ball.Y, ball.r, 0, 2 * Math.PI);
        ctx.fillStyle = ball.color;
        ctx.fill();

        //CANVAS PADDLE
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.X, paddle.Y, paddle.width, paddle.height);
        document.addEventListener('keydown', initGame);

        //CANVAS BRICKS
        for (let i = 0; i < brick.line1.display.length; i++) {
            if (brick.line1.display[i] === true) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.line1.X[i], brick.line1.Y, brick.width, brick.height)
            }
        }
        for (let i = 0; i < brick.line2.X.length; i++) {
            if (brick.line2.display[i] === true) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.line2.X[i], brick.line2.Y, brick.width, brick.height)
            }
        }
        for (let i = 0; i < brick.line3.X.length; i++) {
            if (brick.line3.display[i] === true) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.line3.X[i], brick.line3.Y, brick.width, brick.height)
            }
        }

        //CANVAS SCORE
        ctx.fillStyle = 'white';
        ctx.font = "15px Arial";
        ctx.fillText(`SCORE : 0`, 15, 30);

        //CANVAS START
        ctx.fillStyle = 'white';
        ctx.font = "20px Arial";
        ctx.fillText('Press "space" to start', (game.width / 3), game.height / 3 + 30);

    }, false);

    //FUNCTIONS -------------------------------------------------------------------------------
    // Fonction qui actualise le canvas et redessine la BALL et le PADDLE avec leur nouvelle position
    function displayGame() {
        if (brick.broken.length === brick.line1.X.length + brick.line2.X.length + brick.line3.X.length) {
            ctx.fillStyle = 'red';
            ctx.font = "30px Arial";
            ctx.fillText("YOU WIN", (game.width / 3), game.height / 3);
            game.pause === true;
            return
        }
        else if (game.gameOver === true) { //On peut faire une fonction displayGameOver()
            ctx.fillStyle = '#ff99e2';
            ctx.font = "30px Arial";
            ctx.fillText("GAME OVER", (game.width / 3), game.height / 3);
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText('Press "space" to continue', (game.width / 3) - 15, game.height / 3 + 40);
            return
        }

        //RESET CANVAS
        // On vide le Canvas avant de redessiner
        ctx.clearRect(0, 0, game.width, game.height);

        // On dit au contexte que la couleur de remplissage est gris
        //ctx.fillStyle = game.color;
        // On rempli le Canvas de gris
        //ctx.fillRect(0, 0, game.width, game.height);
        ctx.drawImage(image, 0, 0, game.width, game.height);
        // BALL : On redessine la ball avec sa couleurs et sa nouvelle position
        ctx.beginPath();
        ctx.arc(ball.X, ball.Y, ball.r, 0, 2 * Math.PI);
        ctx.fillStyle = ball.color;
        ctx.fill();

        //On redessine le PADDLE
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.X, paddle.Y, paddle.width, paddle.height);

        //On redessine BRICK LINE1
        for (let i = 0; i < brick.line1.X.length; i++) {
            if (brick.line1.display[i] === true) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.line1.X[i], brick.line1.Y, brick.width, brick.height)
            }
        }
        //On redessine BRICK LINE2
        for (let i = 0; i < brick.line2.X.length; i++) {
            if (brick.line2.display[i] === true) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.line2.X[i], brick.line2.Y, brick.width, brick.height)
            }
        }
        //On redessine BRICK LINE3
        for (let i = 0; i < brick.line3.X.length; i++) {
            if (brick.line3.display[i] === true) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.line3.X[i], brick.line3.Y, brick.width, brick.height)
            }
        }

        //On redessine le SCORE
        ctx.fillStyle = 'white';
        ctx.font = "15px Arial";
        ctx.fillText(`SCORE : ${brick.broken.length}`, 15, 30);


    }

    // Actualise la position de la BALL et actualise le jeu
    function playGame() {
        if (game.start === true && game.pause === false && game.gameOver === false) {
            detectCollisions()

            ball.Y += ball.speed * ball.direction.Y
            ball.X += ball.speed / 3 * ball.direction.X

            displayGame();
            animation = requestAnimationFrame(playGame);
        }

    }

    // Actualise la position du PADDLE en fonction du keydown
    function initGame(e) {
        /** Gestionnaire dévènement clavier
         * @param {event} e l'évènement keydow */
        switch (e.key) {
        case 'ArrowRight':
            if (paddle.X + paddle.width < game.width) paddle.direction = 1;
            else paddle.direction = 0;
            break;
        case 'ArrowLeft':
            if (paddle.X > 0) paddle.direction = -1;
            else paddle.direction = 0;
            break;
        case ' ':
            if (game.gameOver === true) {
                game.gameOver = !game.gameOver
                initPositions()
                playGame()
            }
            if (game.start === true) {
                game.pause = !game.pause
                playGame()
            }

            if (game.start === false) {
                game.start = !game.start;
                playGame()
            }

        default:
            paddle.direction = 0;;
            break;
        }
        paddle.X += paddle.speed * paddle.direction; //mettre dans playGame() pour actualiser à chaque keyFrame pour plus de fluidité

        // On dessine le paddle
        displayGame();
    }

    // Fonction qui détecte les collisions
    function detectCollisions() {
        // Avec les bords du jeu
        if (ball.Y <= (0 + ball.r) || ball.Y >= (game.height - ball.r)) {
            ball.direction.Y *= -1;
        }

        if (ball.Y >= (game.height - ball.r)) {
            game.gameOver = true;
        }

        if (ball.X <= (0 + ball.r) || ball.X >= (game.width - ball.r)) {
            ball.direction.X *= -1;
        }
        // Avec le paddle
        if (ball.X >= paddle.X && ball.X <= (paddle.X + paddle.width)) {
            if (ball.Y === paddle.Y) {
                ball.direction.Y *= -1;
                if (ball.X <= paddle.X + paddle.width / 3) {
                    ball.direction.X = -1
                }
                else if (ball.X <= paddle.X + paddle.width * 2 / 3) {
                    ball.direction.X = 0
                }
                else if (ball.X <= paddle.X + paddle.width) {
                    ball.direction.X = 1
                }
            }
        }
        // Avec les bricks
        for (let i = 0; i < brick.line1.display.length; i++) {
            if (ball.X >= (brick.line1.X[i] - ball.r) && ball.X <= (brick.line1.X[i] + brick.width + ball.r)) {
                if (ball.Y === (brick.line1.Y - ball.r) || ball.Y === (brick.line1.Y + brick.height + ball.r)) {
                    ball.direction.Y *= -1;
                    brick.line1.display[i] = false;
                    brick.line1.X[i] = -70;
                    brick.broken.push(1);
                    if (ball.X <= brick.line1.X[i] + brick.width / 3) {
                        ball.direction.X = -1
                    }
                    else if (ball.X <= brick.line1.X[i] + brick.width * 2 / 3) {
                        ball.direction.X = 0
                    }
                    else if (ball.X <= brick.line1.X[i] + brick.width) {
                        ball.direction.X = 1
                    }
                }
            }
        }
        for (let i = 0; i < brick.line2.display.length; i++) {
            if (ball.X >= (brick.line2.X[i] - ball.r) && ball.X <= (brick.line2.X[i] + brick.width + ball.r)) {
                if (ball.Y === (brick.line2.Y - ball.r) || ball.Y === (brick.line2.Y + brick.height + ball.r)) {
                    ball.direction.Y *= -1;
                    brick.line2.display[i] = false;
                    brick.line2.X[i] = -70;
                    brick.broken.push(1);
                    if (ball.X <= brick.line2.X[i] + brick.width / 3) {
                        ball.direction.X = -1
                    }
                    else if (ball.X <= brick.line2.X[i] + brick.width * 2 / 3) {
                        ball.direction.X = 0
                    }
                    else if (ball.X <= brick.line2.X[i] + brick.width) {
                        ball.direction.X = 1
                    }
                }
            }
        }
        for (let i = 0; i < brick.line3.display.length; i++) {
            if (ball.X >= (brick.line3.X[i] - ball.r) && ball.X <= (brick.line3.X[i] + brick.width + ball.r)) {
                if (ball.Y === (brick.line3.Y - ball.r) || ball.Y === (brick.line3.Y + brick.height + ball.r)) {
                    ball.direction.Y *= -1;
                    brick.line3.display[i] = false;
                    brick.line3.X[i] = -70;
                    brick.broken.push(1);
                    if (ball.X <= brick.line3.X[i] + brick.width / 3) {
                        ball.direction.X = -1
                    }
                    else if (ball.X <= brick.line3.X[i] + brick.width * 2 / 3) {
                        ball.direction.X = 0
                    }
                    else if (ball.X <= brick.line3.X[i] + brick.width) {
                        ball.direction.X = 1
                    }
                }
            }
        }
    }

    // Fonction qui initialise la position de PADDLE et la position et la direction de BALL
    function initPositions() {
        ball.X = game.width / 2;
        ball.Y = game.height / 2;
        ball.direction.Y = 1;
        ball.direction.X = 0;
        paddle.X = game.width / 2 - 25;

    }

    // CODE PRINCIPAL ------------------------------------------------------------------------------------
    initPositions();
    playGame();

})
