import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Score
 */
let score = 0

/**
 * Base
 */
// Debug
let ballSize = .1
let speed = 1

let sizeWidthApparition = 0.002
let sizeHeightApparition = 0.002

const gui = new GUI();

gui.add({ ballSize: ballSize }, 'ballSize')
    .min(0.1)
    .max(1)
    .step(0.01)
    .name('Ball Size')
    .onChange(function(value) {
        object1.geometry.dispose();
        object1.geometry = new THREE.SphereGeometry(value, 16, 16);
    });
    gui.add({ speed: speed }, 'speed')
    .min(1)
    .max(4)
    .step(0.1)
    .name('Speed')
    .onChange(function(value) {
        speed = value;
    });


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Objects
 */

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(ballSize, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
scene.add(object1); // Ajouter la sphère à la scène

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableRotate = false; // Désactiver la rotation
controls.enableZoom = false; // Désactiver le zoom
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;


const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Déplacer l'objet le long de l'axe Y
    object1.position.x = Math.cos(Math.sin(elapsedTime * speed) * 2); // 2 est l'amplitude du mouvement
    object1.position.x += (Math.random() - 0.5) * 0.1; // Ajouter une petite quantité aléatoire à la position X

    // Déplacer l'objet le long de l'axe X
    object1.position.y = Math.sin(Math.cos(elapsedTime * speed) * 2); // 2 est l'amplitude du mouvement
    object1.position.y += (Math.random() - 0.5) * 0.1; // Ajouter une petite quantité aléatoire à la position Y

    //Cast a ray
    raycaster.setFromCamera(mouse, camera);

    const objectsToTest = [object1];
    const intersects = raycaster.intersectObjects(objectsToTest);

    for (const object of objectsToTest) {
        object.material.color.set("#ff0000");
    }
  
    for (const intersect of intersects) {
        intersect.object.material.color.set("#0000ff");
        score += 1;
        updateScore();
    }
  
    if (intersects.length) {
        if (currentIntersect === null) {
        }
        currentIntersect = intersects[0];
    } else {
        if (!currentIntersect) {
        }
        currentIntersect = null;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

function updateScore() {
  let scorePoint = document.getElementById('score')
  scorePoint.innerText = score
}

updateScore()
tick();



