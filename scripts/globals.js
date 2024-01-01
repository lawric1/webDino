import { preloadImages } from "./preload.js"

const layers = {};
const layersDiv = document.getElementById('layers'); // Get the div with ID "layers"

let width = 320,
    height = 180;

let textures = await preloadImages()

// [start, run, gameover];
let gameState = "start";


function layerFactory(layerName, zIndex) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = zIndex;

    const context = canvas.getContext('2d');
    layers[layerName] = context;

    layersDiv.appendChild(canvas); // Append canvas to the "layers" div
}


function setGameState(state) {
    gameState = state;
}


layerFactory("bg1", 1, 320, 180);
layerFactory("bg2", 2, 320, 180);
layerFactory("bg3", 3, 320, 180);
layerFactory("fg", 4, 320, 180);
layerFactory("player", 4, 320, 180);
layerFactory("obstacles", 5, 320, 180);
layerFactory("ui", 6, 320, 180);


export {
    layers,
    width, height,
    textures,
    gameState,
    setGameState
}