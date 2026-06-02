//(HTML)input type="range" id="speedSlider" min="1" max="20" value="5"
//Ici type="range" cree un slider "horizontal", min et max sont les valeurs qu'ils peut prendre et value est la valeur initiale(position initiale du curseur)

let canvas= document.getElementById("canvas");
let ctx= canvas.getContext("2d");

// constantes pour definir la taille du canvas
const CANVAS_WIDTH= canvas.width= 400;
const CANVAS_HEIGHT= canvas.height= 400;

const BALL_SIZE =5;
const PADDLE_WIDTH =4;
const PADDLE_HEIGHT = 12;
//dictionnaire avec les donnees positions de la balle(cle:valeur)
let gameStarted = false;

let lastPaddleIsLeft = false;
let lastPaddleIsRight = false;

let playerScore= 0;
let computerScore= 0;

let objectsColor= "white";

let ballPosition;
let minusBallPosition ={
    x:CANVAS_WIDTH/2,
    y:CANVAS_HEIGHT/2
}

let xSpeed;
let ySpeed;

let computer_speed=2;

let leftPaddlePosition = {
    x:5,
    y:2
}

let rightPaddlePosition = {
    x: CANVAS_WIDTH - PADDLE_WIDTH -5,
    y:2
}

const music = new Audio("sounds/robloxeur-pixel-245147.mp3");
music.loop = true;   // pour que la musique tourne en boucle
music.volume = 0.5;  // volume entre 0 et 1

const speedSlider = document.getElementById("speedSlider");

speedSlider.addEventListener("input", () => {
  xSpeed = Number(speedSlider.value);// comme speedSlider.value est une str, on la convertie en nombre avec Number(...)
  ySpeed = Number(speedSlider.value);
});

document.getElementById("restartButton").addEventListener("click", () => {
    location.reload();//commande pour refresh la page(l'URL),location est un objet qui a ttes les infos de la page
});

document.getElementById("playBtn").addEventListener("click", () => {
    music.play();
    music.currentTime = 0;
});

document.getElementById("stopBtn").addEventListener("click", () => {
    music.pause();
    music.currentTime = 0; // remet au début
});

document.getElementById("redColor").addEventListener("click", () => {
    if (objectsColor == "red") {
        // Si c'est déjà rouge → remettre blanc
        objectsColor = "white";
    } else {
        // Sinon → mettre rouge
        objectsColor = "red";
    }
});

document.getElementById("yellowColor").addEventListener("click", () => {
    if (objectsColor == "yellow") {
        objectsColor = "white";
    } else {
        objectsColor = "yellow";
    }
});

document.getElementById("pinkColor").addEventListener("click", () => {
    if (objectsColor == "palevioletred") {
        objectsColor = "white";
    } else {
        objectsColor = "palevioletred";
    }
});

document.getElementById("greenColor").addEventListener("click", () => {
    if (objectsColor == "rgb(47, 128, 0)") {
        objectsColor = "white";
    } else {
        objectsColor = "rgb(47, 128, 0)";
    }
});


document.addEventListener('mousemove', mouseEvent => {
    if (mouseEvent.y - canvas.offsetTop <=0 || mouseEvent.y - canvas.offsetTop + PADDLE_HEIGHT> CANVAS_HEIGHT) {
        rightPaddlePosition=rightPaddlePosition
    }
    else{
        rightPaddlePosition.y = mouseEvent.y - canvas.offsetTop;//on prend offsetTop et non Top directement car si on precise qu'on veut le top du decalage, la distance souris - canvas.top peut elle varier.
    }
});

//fonction pour commencer le jeu
document.addEventListener("keydown", () => {
    if (!gameStarted) {
        gameStarted = true;
    }
});

function initBall() {
    ballPosition = {
    x:20,
    y:30
    };
    xSpeed= 4;
    ySpeed= 2;
    lastPaddleIsLeft=false;
    lastPaddleIsRight=false;
    if(playerScore!=0 || computerScore!=0){//pour augmenter la vitesse a chaque point marqué
        xSpeed++;
        ySpeed++;
        computer_speed++;
    }
}

initBall();

//fonction qui gère le déplacement du paddle gauche
function followBall() {
    //on a uniquement les coordonnees necessaires au suivi de la balle par le paddle auto(si paddletop>balltop, monter..)
    let ball= {
        top: ballPosition.y,
        bottom: ballPosition.y+BALL_SIZE
    }
    let leftPaddle= {
        top: leftPaddlePosition.y,
        bottom: leftPaddlePosition.y+PADDLE_HEIGHT
    }

    if (ball.top<leftPaddle.top) {
        leftPaddlePosition.y-= computer_speed;
    }else if (ball.bottom>leftPaddle.bottom) {
        leftPaddlePosition.y+= computer_speed;
    }
}

function draw() {
    //remplissage de l'espace de jeu
    ctx.fillStyle= "black";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    //dessin de l'ecran initial
    if (!gameStarted) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText("Press any key to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        ctx.font = "15px Arial";
        ctx.fillText("Avoid the minus ball..", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);

        return;
    }
    //remplissage de la balle et des paddles
    //NOTER QUE FONT-FAMILY DANS CSS, C'EST POUR LA POLICE D'ECRITURE
    ctx.fillStyle= objectsColor;
    ctx.fillRect(ballPosition.x,ballPosition.y,BALL_SIZE,BALL_SIZE);
    ctx.fillRect(leftPaddlePosition.x,leftPaddlePosition.y,PADDLE_WIDTH,PADDLE_HEIGHT);
    ctx.fillRect(rightPaddlePosition.x,rightPaddlePosition.y,PADDLE_WIDTH,PADDLE_HEIGHT);
    ctx.font= "30px monospace";
    ctx.textAlign= "left";
    ctx.fillText(computerScore.toString(), 50, 50);
    ctx.textAlign= "right";
    ctx.fillText(playerScore.toString(), CANVAS_WIDTH-50, 50);
    ctx.fillStyle= "orange";
    ctx.fillRect(minusBallPosition.x,minusBallPosition.y,7,7); 

}

function updatePostion(){
    ballPosition.x+=xSpeed;
    ballPosition.y+=ySpeed;
    followBall();
}

function checkCollision() {
    let ball= {
        left: ballPosition.x,
        right: ballPosition.x + BALL_SIZE,
        //+ballSize car vu que c'est un carré, longueur = largeur et ballsize
        top: ballPosition.y,
        bottom: ballPosition.y + BALL_SIZE,
    }

    let minusBall= {
        left: minusBallPosition.x,
        right: minusBallPosition.x + 7,
        top: minusBallPosition.y,
        bottom: minusBallPosition.y + 7,
    }

    let leftPaddle= {
        left:leftPaddlePosition.x,
        right:leftPaddlePosition.x+PADDLE_WIDTH,
        top:leftPaddlePosition.y,
        bottom:leftPaddlePosition.y+PADDLE_HEIGHT,
    }

    let rightPaddle= {
        left:rightPaddlePosition.x,
        right:rightPaddlePosition.x+PADDLE_WIDTH,
        top:rightPaddlePosition.y,
        bottom:rightPaddlePosition.y+PADDLE_HEIGHT,
    }

    if (checkPaddleCollision(ball,leftPaddle)){
        lastPaddleIsLeft= true;
        lastPaddleIsRight= false;
        xSpeed=Math.abs(xSpeed)
        //Math.abs sinon en tapant du bord droit du canvas au top du paddle right, on allait inverser encore la vitesse cequi est impossible dans le vrai ping pong (I mean la balle doit continuer son chemin normally)
        let distanceFromTop= ball.top-leftPaddle.top//(si<0,balle tape en haut du paddle selon l'axe y descendant)
        let distanceFromBottom= leftPaddle.bottom-ball.bottom //(si<0,balle tape en bas du paddle selon l'axe y descendant)
        adjustAngle(distanceFromTop,distanceFromBottom)
    }

    if (checkPaddleCollision(ball,rightPaddle)){
        lastPaddleIsRight=true;
        lastPaddleIsLeft= false;
        xSpeed=-Math.abs(xSpeed)
        let distanceFromTop= ball.top-rightPaddle.top
        let distanceFromBottom= rightPaddle.bottom-ball.bottom
        adjustAngle(distanceFromTop,distanceFromBottom)
    }

    if (checkBallsCollision(ball,minusBall)){
        respawnMinus();
        if (lastPaddleIsLeft && computerScore>0){
            computerScore--;
        }
        if (lastPaddleIsRight && playerScore>0){
            playerScore--;
        }
    }

    if (ball.left<0) {
        playerScore++;
        speedSlider.value++;
        initBall();
        gameOver();
    }else if(ball.right>CANVAS_WIDTH){
        computerScore++;
        speedSlider.value++;
        initBall();
        gameOver();
    }

    if (ball.top<0 || ball.bottom>CANVAS_HEIGHT) {
        ySpeed= -ySpeed
    }
}

function checkPaddleCollision(ball,paddle){
    return (
        ball.left <= paddle.right && ball.right >= paddle.left && ball.top <= paddle.bottom && ball.bottom >= paddle.top
    );
}

function checkBallsCollision(ball,minusBall) {
    return (
        ball.left <= minusBall.right && ball.right >= minusBall.left && ball.top <= minusBall.bottom && ball.bottom >= minusBall.top
    );
}

function adjustAngle(distanceFromTop,distanceFromBottom) {//pas trop important, juste pour que si la balle touche les angles des paddles elle ait un effet sur la vitesse verticale(ySpeed),comme au ping pong un peu..
    if (distanceFromTop<0) {
        ySpeed-=0.5
    }
    else if (distanceFromBottom<0) {
        ySpeed+=0.5
    }
}

function respawnMinus() {
    ctx.fillStyle= "black";
    ctx.fillRect(minusBallPosition.x,minusBallPosition.y,7,7);
    ctx.fillStyle= "orange";
    minusBallPosition.x= randInt(20,380);
    minusBallPosition.y= randInt(20,380);
    ctx.fillRect(minusBallPosition.x,minusBallPosition.y,7,7);
}

function randInt(min,max){
    return(
       Math.floor(Math.random() * (max - min + 1)) + min
       //random() donne un rand decimal entre 0 et 1, on veut max-min+1(car entre 0 et 4= 5possibiltes par exemple) possibilites d'ou la multiplication(principe du produit), on prend la partie entiere de tout ca qui nous donne un nb de 0 a max-min, et on decale en faisant +min
    );
}

function gameOver() {
    if(computerScore==11){
        ctx.fillStyle= "black";
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 32px Verdana";
        ctx.fillText("Computer won!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.font = "bold 24px Verdana";
        ctx.fillText("("+computerScore+"-"+playerScore+")",CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
        music.pause();
        music.currentTime = 0;
    }
    if(playerScore==11){
        ctx.fillStyle= "black";
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 32px Verdana";
        ctx.fillText("Congrats,you won!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.font = "bold 24px Verdana";
        ctx.fillText("("+playerScore+"-"+computerScore+")",CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
        music.pause();
        music.currentTime = 0;
    }
}

function gameLoop(){
    draw();
    if (gameStarted) {
        updatePostion();
        checkCollision();
    }
    
    if(computerScore<11 && playerScore<11){
        setTimeout(gameLoop,30);
    }
}

gameLoop();



