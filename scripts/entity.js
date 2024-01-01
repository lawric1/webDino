import { 
  textures, 
  layers,
  width, height, gameState, 
} from "./globals.js";
import { isActionPressed, isActionJustPressed } from "./input.js";
import { randomInt } from "./utils.js";

class Entity {
    constructor(updateFrameRate = 60, renderFrameRate = 60, animateFrameRate = 60) {
		this.isRunning = false;
		this.updateFrameRate = updateFrameRate;
		this.renderFrameRate = renderFrameRate;
		this.animateFrameRate = animateFrameRate;
		this.lastUpdateTime = performance.now();
		this.lastRenderTime = performance.now();
		this.lastAnimateTime = performance.now();
		this.deltaTime = 0;
	}
  
    update() {}
  
    render() {}

    animate() {}
  
    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.updateLoop();
        this.renderLoop();
        this.animateLoop();
      }
    }
  
    stop() {
      this.isRunning = false;
    }
  
    updateLoop() {
      if (this.isRunning) {
        const currentTime = performance.now();
        const elapsedUpdateTime = currentTime - this.lastUpdateTime;
        this.deltaTime = elapsedUpdateTime/1000;
  
        if (elapsedUpdateTime >= 1000 / this.updateFrameRate) {
          this.update();
          this.lastUpdateTime = currentTime;
        }
  
        requestAnimationFrame(() => this.updateLoop());
      }
    }
  
    renderLoop() {
      if (this.isRunning) {
        const currentTime = performance.now();
        const elapsedRenderTime = currentTime - this.lastRenderTime;
  
        if (elapsedRenderTime >= 1000 / this.renderFrameRate) {
          this.render();
          this.lastRenderTime = currentTime;
        }
  
        requestAnimationFrame(() => this.renderLoop());
      }
    }

	animateLoop() {
		if (this.isRunning) {
		  const currentTime = performance.now();
		  const elapsedRenderTime = currentTime - this.lastAnimateTime;
	
		  if (elapsedRenderTime >= 1000 / this.animateFrameRate) {
			this.animate();
			this.lastAnimateTime = currentTime;
		  }
	
		  requestAnimationFrame(() => this.animateLoop());
		}
	  }
  }
  

export class Dino extends Entity {
    constructor(x, y, frameWidth) {
        super(120, 120, 10);
        this.x = x;
        this.y = y;
		this.w = 24;
		this.h = 24;
		this.centerX;
		this.centerY;

        this.vely = 0;
        this.gravity = 9;
        this.jumpForce = -200;
        this.floorHeight = height - 52;
        this.onGround = true;
		this.isDead = false;

        this.spritesheet = textures.dino;
        this.currentFrame = 0;
		this.startFrame = 0;
        this.maxFrames = (textures.dino.naturalWidth / frameWidth) - 1;
        this.frameWidth = frameWidth;
        this.frameHeight = frameWidth
		this.animState = "idle";

		this.closestObstacle;
    }

    update() {
		if (gameState === "start") {
			this.idle();
			return;
		}

		if (gameState === "gameover") {
			return;
		}

		this.centerX = this.x + 16;
		this.centerY = this.y + this.h;
		this.handleCollision();
		

		this.onGround = this.y === this.floorHeight;

		this.vely += this.gravity;
		this.y += Math.floor(this.vely * this.deltaTime);

		if (this.y >= this.floorHeight) {
			this.y = this.floorHeight;
			this.run();
			this.animState = "run";
		}

		if (isActionJustPressed("jump") && this.onGround) {
			this.jump();
			this.animState = "jump";
		}

		if (isActionPressed("duck")) {
			this.duck();        
			this.animState = "duck";
		}
		
    }

	render() {
		layers.player.clearRect(0, 0, width, height);
		
		layers.player.drawImage(
			this.spritesheet, 
			this.currentFrame * this.frameWidth, 0, 
			this.frameWidth, this.frameHeight,
			this.x, this.y,
			this.frameWidth, this.frameHeight
		)
		layers.player.fillStyle = "white";
	}
		
	animate() {
		if (gameState === "gameover") {
			return;
		}

		this.currentFrame += 1;

		if (this.currentFrame >= this.startFrame + 3) {
			this.currentFrame = this.startFrame;
		}

		if (this.animState === "jump") {
			this.currentFrame = this.maxFrames - 1;
		}

		if (this.animState === "duck") {
			this.currentFrame = this.maxFrames;
		}
	}

    idle() {
		this.startFrame = 0;
    }
    run() {
		this.startFrame = 4;
    }
    jump() {
        this.vely = this.jumpForce;
    }
    duck() {
        this.vely += this.gravity * 4;
    }

    
	handleCollision() {
		if (!this.closestObstacle) {
			return;
		}

		
		let rangeSquared = 100;
		let dx = this.closestObstacle.centerX - this.centerX;
		let dy = this.closestObstacle.centerY - this.centerY;
		let distanceSquared = dx * dx + dy * dy;

		if (distanceSquared <= rangeSquared) {
			this.isDead = true;
		}
	}
}

export class Obstacle {
	constructor() {
		this.x = width + 50;
		this.y = height - 20;
		this.centerX;
		this.centerY;

		this.spritesheet = textures.obstacles;
		this.types = {
			a: [2, 16, 12, 16],
			b: [22, 16, 19, 16],
			c: [55, 11, 19, 21],
			d: [83, 11, 27, 21],
		};
		this.currentType;
		this.onScreen = true;
	}


	update(speed) {
		let [x, y, w, h] = this.currentType;

		this.x -= speed;
		this.centerX = this.x + w / 2;
		this.centerY = this.y - h / 2;

		if (this.x < -50) {
			this.onScreen = false;
		}
	}

	render() {
		if (this.onScreen) {
			let [x, y, w, h] = this.currentType;
			layers.obstacles.drawImage(this.spritesheet, x, y, w, h, Math.floor(this.x), this.y - h, w, h);
		}
	}

	pickType() {
		let index = randomInt(0, 3);
		this.currentType = Object.values(this.types)[index];
	}
}