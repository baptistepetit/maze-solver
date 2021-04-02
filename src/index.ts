import '../style/main.css';
import { Visualizer } from './views/visualizer';
import { Maze } from './models/maze';

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const container = document.getElementById('appContainer') as HTMLDivElement;
const fileLoader = document.getElementById('fileLoader') as HTMLInputElement;

const visualizer = new Visualizer(canvas, container);
const maze = new Maze();

window.addEventListener('load', () => visualizer.init());
window.addEventListener('resize', () => visualizer.resize());

async function loadMaze(file: Blob) {
    await maze.loadFromFile(file);
    visualizer.loadMaze(maze.obj);
}

fileLoader.addEventListener('change', (event) => {
    const eventTarget = event.target as HTMLInputElement;
    const file = eventTarget.files[0];
    loadMaze(file);
});
