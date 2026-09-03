// // src/main.ts — Three.js WebGL Startup & Security Guard Hook
import * as THREE from 'three';
import { securityGuard } from './security/secureshield';

async function initScene() {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  
  // 🛡️ Step 1: Initialize SecureShield RASP before instantiating WebGL context
  const report = await securityGuard.initialize(canvas);
  if (!report || report.verdict === 'COMPROMISED') {
    console.error('[SecureShield] WebGL context initialization halted: host compromised');
    return;
  }

  // 🛡️ Step 2: Initialize Three.js WebGL Scene & Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.8 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(2, 4, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040, 1.0));

  camera.position.z = 3;

  // 🛡️ Step 3: Render Loop with Continuous RASP Integrity Checks
  function animate() {
    requestAnimationFrame(animate);

    if (securityGuard.isCleanForAction()) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
  }

  animate();
}

window.addEventListener('DOMContentLoaded', initScene);