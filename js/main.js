import * as THREE from 'three';

const canvas = document.getElementById('webgl');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Renderer / Scene / Camera ---------- */

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.7, 4.4);

/* ---------- Lights ---------- */

const key = new THREE.SpotLight(0xfff2e0, 6, 20, Math.PI / 6, 0.4, 1.2);
key.position.set(2.2, 4, 3);
scene.add(key);

const rim = new THREE.PointLight(0xc1440e, 6, 12);
rim.position.set(-2.5, 1.5, -2);
scene.add(rim);

const fill = new THREE.AmbientLight(0x8a8d8f, 0.5);
scene.add(fill);

/* ---------- Pedestal ---------- */

const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x2a2926, roughness: 0.4, metalness: 0.6 });
const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.3, 64), pedestalMat);
pedestal.position.y = -0.85;
scene.add(pedestal);

const ringMat = new THREE.MeshStandardMaterial({ color: 0xc1440e, emissive: 0xc1440e, emissiveIntensity: 1.4, roughness: 0.3 });
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.31, 0.012, 16, 100), ringMat);
ring.rotation.x = Math.PI / 2;
ring.position.y = -0.69;
scene.add(ring);

/* ---------- Product (tub) ---------- */

const productGroup = new THREE.Group();
scene.add(productGroup);

const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf2f0eb, roughness: 0.55, metalness: 0.05 });
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 1.25, 48), bodyMat);
productGroup.add(body);

const bandMat = new THREE.MeshStandardMaterial({ color: 0xc1440e, roughness: 0.4, metalness: 0.1 });
const band = new THREE.Mesh(new THREE.CylinderGeometry(0.562, 0.562, 0.42, 48), bandMat);
band.position.y = -0.05;
productGroup.add(band);

const lidMat = new THREE.MeshStandardMaterial({ color: 0x1e1d1b, roughness: 0.35, metalness: 0.3 });
const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.585, 0.585, 0.22, 48), lidMat);
lid.position.y = 0.735;
productGroup.add(lid);

productGroup.position.y = -0.1;

/* ---------- Ingredient pieces ---------- */

const ingredientsGroup = new THREE.Group();
scene.add(ingredientsGroup);

const scoopMat = new THREE.MeshStandardMaterial({ color: 0xece4d6, roughness: 0.85 });
const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32), scoopMat);
scoop.scale.set(1, 0.55, 1);
const scoopHandleMat = new THREE.MeshStandardMaterial({ color: 0x8a8d8f, roughness: 0.4, metalness: 0.7 });
const scoopHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16), scoopHandleMat);
scoopHandle.rotation.z = Math.PI / 2.4;
scoopHandle.position.set(0.35, -0.05, 0);
const scoopPiece = new THREE.Group();
scoopPiece.add(scoop, scoopHandle);

const crystalMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.9,
  thickness: 0.4, ior: 1.3, clearcoat: 1
});
const crystalPiece = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 0), crystalMat);

const capsuleGroup = new THREE.Group();
const capOrangeMat = new THREE.MeshStandardMaterial({ color: 0xc1440e, roughness: 0.3 });
const capWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf2f0eb, roughness: 0.3 });
const capHalf1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.42, 4, 16), capOrangeMat);
const capHalf2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.42, 4, 16), capWhiteMat);
capHalf1.rotation.z = Math.PI / 2;
capHalf2.rotation.z = Math.PI / 2;
capsuleGroup.add(capHalf1, capHalf2);

const pieces = [scoopPiece, crystalPiece, capsuleGroup];
const restPositions = pieces.map(() => new THREE.Vector3(0, -0.1, 0));
const targetPositions = [
  new THREE.Vector3(-1.5, 0.5, 0.4),
  new THREE.Vector3(0, 1.0, -0.6),
  new THREE.Vector3(1.5, 0.4, 0.4)
];
const targetRotSpeeds = [0.4, 0.6, 0.5];

pieces.forEach((p, i) => {
  p.position.copy(restPositions[i]);
  p.scale.setScalar(0.001);
  ingredientsGroup.add(p);
});

/* ---------- Particles ---------- */

const particleCount = reduceMotion ? 0 : 160;
let particles;
if (particleCount > 0) {
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.6 + Math.random() * 1.4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 2.2 - 0.6;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xc1440e, size: 0.02, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
  particles = new THREE.Points(geo, mat);
  scene.add(particles);
}

/* ---------- Scroll-driven state ---------- */

const breakdownEl = document.getElementById('breakdown');
const panels = Array.from(document.querySelectorAll('.ingredient-panel'));
const canvasEl = document.getElementById('webgl');
const aboutEl = document.getElementById('about');

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function clamp01(v) { return Math.max(0, Math.min(1, v)); }

function getBreakdownProgress() {
  const rect = breakdownEl.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return 0;
  const scrolled = -rect.top;
  return clamp01(scrolled / total);
}

function getFadeOutProgress() {
  const rect = aboutEl.getBoundingClientRect();
  const p = 1 - clamp01(rect.top / window.innerHeight);
  return clamp01(p);
}

/* ---------- Animation loop ---------- */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  const breakdownProgress = getBreakdownProgress();
  const eased = easeInOutCubic(breakdownProgress);
  const fadeOut = getFadeOutProgress();

  if (!reduceMotion) {
    productGroup.rotation.y = t * 0.22 + breakdownProgress * 1.4;
    ingredientsGroup.rotation.y = productGroup.rotation.y;
  }

  const parallaxStrength = (1 - breakdownProgress) * 0.15;
  productGroup.position.x = mouseX * parallaxStrength;
  productGroup.position.z = mouseY * parallaxStrength * 0.5;

  const lidProgress = clamp01(eased / 0.3);
  lid.position.y = 0.735 + lidProgress * 0.9;
  lid.rotation.x = lidProgress * 0.6;

  pieces.forEach((p, i) => {
    const start = i * 0.12;
    const local = clamp01((eased - start) / (0.7 - start));
    const localEased = easeInOutCubic(local);
    p.position.lerpVectors(restPositions[i], targetPositions[i], localEased);
    p.scale.setScalar(0.001 + localEased * 0.999);
    if (!reduceMotion) p.rotation.y = t * targetRotSpeeds[i];
  });

  band.scale.y = 1 - eased * 0.3;

  camera.position.x = Math.sin(breakdownProgress * 0.5) * 1.2;
  camera.position.y = 0.7 + breakdownProgress * 0.5;
  camera.position.z = 4.4 - breakdownProgress * 0.9;
  camera.lookAt(0, 0.15 + breakdownProgress * 0.2, 0);

  if (particles && !reduceMotion) particles.rotation.y = t * 0.03;

  panels.forEach((panel) => {
    const idx = Number(panel.dataset.index);
    const rangeStart = idx * 0.33;
    const rangeEnd = rangeStart + 0.33;
    const active = breakdownProgress >= rangeStart && breakdownProgress < rangeEnd + (idx === panels.length - 1 ? 0.1 : 0);
    panel.classList.toggle('is-active', active);
  });

  canvasEl.style.opacity = String(1 - fadeOut * 0.85);

  renderer.render(scene, camera);
}
animate();

/* ---------- Resize ---------- */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- Category filter ---------- */

const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.product-card');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const filter = tab.dataset.filter;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});
