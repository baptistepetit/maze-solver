import {
    AmbientLight,
    Box3,
    Color,
    DirectionalLight,
    DoubleSide,
    Material,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector3,
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
    private materials: Map<string, Material>;
    private raycaster: Raycaster;

    constructor(_canvas: HTMLCanvasElement, _container: HTMLDivElement) {
        this.camera = new PerspectiveCamera(75, _canvas.clientWidth / _canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.container = _container;
        this.renderer = new WebGLRenderer({ canvas: _canvas });
        this.scene = new Scene();
        this.scene.background = new Color(0x2A2A2A);
        this.controls = new OrbitControls(this.camera, _canvas);
        this.controls.update();
        this.raycaster = new Raycaster();

        this.materials = new Map<string, Material>();
        const materialEnd = new MeshPhongMaterial({
            color: 0x6CFF00,
            side: DoubleSide,
        });
        const materialNone = new MeshPhongMaterial({
            color: 0xACACAC,
            side: DoubleSide,
        });
        const materialPath = new MeshPhongMaterial({
            color: 0xFF3D14,
            side: DoubleSide,
        });
        const materialStart = new MeshPhongMaterial({
            color: 0x0093FF,
            side: DoubleSide,
        });
        this.materials.set('End', materialEnd);
        this.materials.set('None', materialNone);
        this.materials.set('Path', materialPath);
        this.materials.set('Start', materialStart);

        const ambientLight = new AmbientLight(0xCCCCCC, 0.4);
        const directionalLight = new DirectionalLight();
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    private animate(): void {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    private fitCameraToObject(object: Object3D, fitOffset = 1.5) {
        const box = new Box3();
        box.setFromObject(object);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * this.camera.fov / 180));
        const fitWidthDistance = fitHeightDistance / this.camera.aspect;
        const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

        const direction = this.controls.target.clone()
            .sub(this.camera.position)
            .normalize()
            .multiplyScalar(distance);

        this.controls.maxDistance = distance * 10;
        this.controls.target.copy(center);

        this.camera.near = distance / 100;
        this.camera.far = distance * 100;
        this.camera.updateProjectionMatrix();

        this.camera.position.copy(this.controls.target).sub(direction);
        this.controls.update();
    }

    private setMaterial(object: Object3D, material: string): void {
        object.traverse((child) => {
            if (child instanceof Mesh) {
                child.material = this.materials.get(material);
            }
        });
    }

    init(): void {
        this.resize();
        this.animate();
    }

    loadMaze(obj: string): void {
        const objLoader = new OBJLoader();
        const mazeObj = objLoader.parse(obj);
        this.setMaterial(mazeObj, 'None');
        this.scene.add(mazeObj);
        this.fitCameraToObject(mazeObj);
    }

    pick(position: {x: number, y: number}): string {
        this.raycaster.setFromCamera(position, this.camera);
        const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersectedObjects.length > 0) {
            const closestObject = intersectedObjects[0].object;
            return closestObject.name;
        }
        return null;
    }

    resize(): void {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    setMaterialFromName(name: string, material: string): void {
        const object = this.scene.getObjectByName(name);
        this.setMaterial(object, material);
    }
}
