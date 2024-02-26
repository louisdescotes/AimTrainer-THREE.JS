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
        object2.geometry.dispose();
        object2.geometry = new THREE.SphereGeometry(value, 16, 16);
        object3.geometry.dispose();
        object3.geometry = new THREE.SphereGeometry(value, 16, 16);
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
object1.position.x =  (Math.random(sizes.width) * 4.0) - (Math.random() * (2 - -3));
object1.position.y =  (Math.random(sizes.height) * 2.0  )  - (Math.random() * (-1 - -3));




const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(ballSize, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object2.position.x =  (Math.random(sizes.width) * 4.0) - (Math.random() * (2 - -3));
object2.position.y =  (Math.random(sizes.height) * 2.0  )  - (Math.random() * (-1 - -3));

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(ballSize, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x =  (Math.random(sizes.width) * 4.0) - (Math.random() * (2 - -3));
object3.position.y =  (Math.random(sizes.height) * 2.0)  - (Math.random() * (-1 - -3));

scene.add(object1, object2, object3);


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
 * Score
 */
window.addEventListener("click", (event) => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        object1.visible = false;
        score += 1
        setTimeout(() => {
          object1.position.x =  (Math.random(sizes.width) * 4.0) - (Math.random() * (2 - -3));
          object1.position.y =  (Math.random(sizes.height) * 2.0  )  - (Math.random() * (-1 - -3));
          object1.visible = true
          console.log(object1)
        }, 50)
        break;
        case object2:
          object2.visible = false;
          score += 1
          setTimeout(() => {
            object2.position.x =  (Math.random(sizes.width) * 4.0) - (Math.random() * (2 - -3));
            object2.position.y =  (Math.random(sizes.height) * 2.0  )  - (Math.random() * (-1 - -3));
            object2.visible = true
            console.log(object2) 
          }, 50)
          break;
          case object3:
            object3.visible = false;
            score += 1
            setTimeout(() => {
              object3.position.x =  (Math.random(sizes.width) * 4.0) - (Math.random() * (2 - -3));
              object3.position.y =  (Math.random(sizes.height) * 2.0  )  - (Math.random() * (-1 - -3));
              object3.visible = true
              console.log(object3)
            }, 50)
            break;
    }
    updateScore(); // Mettre à jour le score après chaque clic

  }
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

  // Animate objects
  // object1.position.y = Math.sin(elapsedTime * 3.0) * 1.5;
  // object1.position.x = Math.sin(elapsedTime * 0.3) * 1.5;
  // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  // object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  //Cast a ray

  raycaster.setFromCamera(mouse, camera);

  // const rayOrgin = new THREE.Vector3(-3, 0, 0)
  // const rayDirection = new THREE.Vector3(1, 0, 0)
  // rayDirection.normalize()

  // raycaster.set(rayOrgin, rayDirection)

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
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



