import * as THREE from 'three';

export class World {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public cube: THREE.Mesh;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 3;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light
    const dirLight = new THREE.DirectionalLight(0x58a6ff, 1.5);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    // 3D Geometry
    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x388bfd,
      roughness: 0.3,
      metalness: 0.8
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  public update(): void {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.015;
  }
}
