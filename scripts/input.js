let actions = {
    jump: ["ArrowUp", "w", "W", " "],
    duck: ["ArrowDown", "s", "S"],
    start: ["Enter"],
    restart: ["r", "R"],
};

let pressedKeys = new Set();
let justPressedKeys = new Set();
let canUpdate = true;
let previousKeyState = new Set();

// Event listeners for key presses and releases
window.addEventListener("keydown", (event) => {
    event.preventDefault();
    pressedKeys.add(event.key);
    justPressedKeys.add(event.key);
});

window.addEventListener("keyup", (event) => {
    event.preventDefault();
    pressedKeys.delete(event.key);
    previousKeyState.add(event.key);

    canUpdate = true;
});

export function isActionPressed(action) {
    for (const key of actions[action]) {
        if (pressedKeys.has(key)) { return 1; }
    }

    return 0;
}

export function isActionJustPressed(action) {
    for (const key of actions[action]) {
        if (justPressedKeys.has(key)) {
            justPressedKeys.delete(key);
            return 1;
        }
    }
    return 0;
}

export function IsActionReleased(action) {
    for (const key of actions[action]) {
        if (previousKeyState.has(key)) {
            previousKeyState.delete(key);
            return 1;
        }
    }

    return 0;
}