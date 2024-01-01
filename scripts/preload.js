let urls = {
  start: "./assets/startscreen.png",
  gameover: "./assets/gameover.png",
  bg: "./assets/background.png",
  mg: "./assets/middleground.png",
  floor: "./assets/floor.png",
  dino: "./assets/dino-Sheet.png",
  obstacles: "./assets/obstacles.png",
};

export async function preloadImages() {
    const loadedImages = {};
  
    const promises = Object.entries(urls).map(([name, url]) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
  
        image.onload = () => {
          loadedImages[name] = image;
          resolve();
        };
  
        image.onerror = () => reject(`Image '${name}' failed to load: ${url}`);
      });
    });
  
    await Promise.all(promises);
  
    return loadedImages;
}

export {
    urls
}