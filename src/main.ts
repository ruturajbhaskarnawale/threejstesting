import { World } from './scene/World';
import { Renderer } from './scene/Renderer';

// Initialize Three.js 3D Scene
const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
const world = new World();
const renderer = new Renderer(canvas, world);

function animate() {
  requestAnimationFrame(animate);
  world.update();
  renderer.render();
}

animate();
console.log('[Three.js Engine] WebGL 3D Scene and RASP Watchdog running.');
