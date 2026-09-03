import * as THREE from 'three';
import { World } from './World';

export class Renderer {
  public renderer: THREE.WebGLRenderer;
  private world: World;

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.world = world;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', () => {
      this.world.camera.aspect = window.innerWidth / window.innerHeight;
      this.world.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  public render(): void {
    this.renderer.render(this.world.scene, this.world.camera);
  }
}
