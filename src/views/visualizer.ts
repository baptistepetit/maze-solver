import {
    AmbientLight,
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Visualizer {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private renderer: WebGLRenderer;
    private controls: OrbitControls;
    private scene: Scene;

    constructor(_canvas: HTMLCanvasElement, _container: HTMLDivElement) {
        this.camera = new PerspectiveCamera(75, _canvas.clientWidth / _canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.container = _container;
        this.renderer = new WebGLRenderer({ canvas: _canvas });
        this.scene = new Scene();
        this.controls = new OrbitControls(this.camera, _canvas);
        this.controls.update();

        const ambientLight = new AmbientLight(0xCCCCCC, 0.4);
        const directionalLight = new DirectionalLight();
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    private animate(): void {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    loadMaze(obj: string): void {
        const objLoader = new OBJLoader();
        const mazeObj = objLoader.parse(obj);
        this.scene.add(mazeObj);
    }

    resize(): void {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    init(): void {
        this.resize();
        this.animate();
    }
}
