import '../style/main.css';

import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';


const container = document.getElementById('appContainer');
const canvas = document.getElementById('scene') as HTMLCanvasElement;
const renderer = new WebGLRenderer({canvas});
const scene = new Scene();
const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 5;

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.add(cube);

function resizeCanvas() {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

const animate = function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

function init() {
    resizeCanvas();
    animate();
}


window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', init);
