import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';

export class View {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private cube: Mesh;
    private renderer: WebGLRenderer;
    private scene: Scene;

    constructor(_canvas: HTMLCanvasElement, _container: HTMLDivElement) {
        this.camera = new PerspectiveCamera(75, _canvas.clientWidth / _canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.container = _container;
        this.renderer = new WebGLRenderer({ canvas: _canvas });
        this.scene = new Scene();

        // Example Object
        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    private animate(): void {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate.bind(this));
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
