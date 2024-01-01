import { 
    textures, 
    layers,
    width, height, 
    gameState, setGameState  
} from "./globals.js";
import { choose } from "./utils.js";
import { Dino } from "./entity.js";
import { Obstacle } from "./entity.js";
import { IsActionReleased } from "./input.js";
import { drawText } from "./font.js";

let scrollSpeed = 1;
let floorOffeset = 1;
let bushOffset = 1;
let mountainOffset = 1;
let dino;
let obstacles = [];

let score = 0;
let highScore = 0;


function initialize() {
    dino = new Dino(10, height-52, 32);
    dino.start();
}

// Update

function autoScrollLayer(ctx, texture, offsetX) {
    let x1 = Math.floor(-offsetX);
    let x2 = Math.floor(width-offsetX);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(texture, x1, 0, width, height);
    ctx.drawImage(texture, x2, 0, width, height);
}

let spawnFrameRate = 2000;
let lastSpawnTime = 0;
function spawnObstacles() {
    const currentTime = performance.now();
    const elapsedSpawnTime = currentTime - lastSpawnTime;
  
    if (elapsedSpawnTime >= spawnFrameRate) {
        let obstacle = new Obstacle();
        obstacle.pickType();
        obstacles.push(obstacle);
    
        lastSpawnTime = currentTime;
        spawnFrameRate = choose([1500, 2000, 2500, 3000]);
    }
}

function updateObstacles() {
    layers.obstacles.clearRect(0, 0, 320, 180);
    
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.update(scrollSpeed);
        obstacle.render();
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        if (obstacle.onScreen === false) {
            obstacles.splice(i, 1);
        }
    }
}

function setHighScore() {
    if (score > highScore) {
        highScore = score;
    }
}

function update() {
    updateObstacles();
    dino.closestObstacle = obstacles[0];

    if (dino.isDead && gameState === "run") {
        setGameState("gameover");
        setHighScore();

        return;
    }

    score += 1;

    autoScrollLayer(layers.fg, textures.floor, floorOffeset);
    floorOffeset += scrollSpeed;
    floorOffeset = floorOffeset % 320;
    autoScrollLayer(layers.bg3, textures.mg, bushOffset);
    bushOffset += scrollSpeed / 2;
    bushOffset = bushOffset % 320;
    autoScrollLayer(layers.bg2, textures.bg, mountainOffset);
    mountainOffset += scrollSpeed / 5;
    mountainOffset = mountainOffset % 320;

    scrollSpeed += 0.0002;
}



// Draw
function resetGame() {
    dino.stop();
    
    layers.bg2.clearRect(0, 0, width, height);
    layers.bg3.clearRect(0, 0, width, height);
    layers.fg.clearRect(0, 0, width, height);
    layers.player.clearRect(0, 0, width, height)
    layers.obstacles.clearRect(0, 0, width, height);

    obstacles = [];
    scrollSpeed = 1;
    score = 0;
}

function drawStart() {
    layers.bg2.drawImage(textures.bg, 0, 0);
    layers.bg3.drawImage(textures.mg, 0, 0);
    layers.fg.drawImage(textures.floor, 0, 0);
    layers.fg.drawImage(textures.start, 0, 0);
}

function drawGameOver() {
    layers.fg.drawImage(textures.gameover, 0, 0);
}

function drawUI() {
    let label = "score: " + score.toString();
    let label2 = "hiscore: " + highScore.toString(); 
    drawText(layers.ui, label, 10, 10, 1);
    drawText(layers.ui, label2, 10, 20, 1);
}

function renderGame(timestamp) {
    if (gameState === "start") { drawStart(); }
    else if (gameState === "gameover") { drawGameOver(); }
    else if (gameState === "run") { 
        update();
        spawnObstacles();
        drawUI();
    }

    // Handle States
    if (IsActionReleased("start") && gameState === "start") {
        setGameState("run");
        initialize();
    }
    else if (IsActionReleased("restart") && gameState === "gameover") { 
        resetGame();
        setGameState("start"); 
    }

    
    requestAnimationFrame(renderGame);
}
function renderBackground() {
    let ctx = layers.bg1;
    ctx.fillStyle = "#ae81ff";
    ctx.fillRect(0, 0, 320, 180);
}

renderBackground();
renderGame();