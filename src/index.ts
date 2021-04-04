import '../style/main.css';
import { Visualizer } from './views/visualizer';
import { Maze } from './models/maze';
import { Buttons } from './views/buttons';

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const container = document.getElementById('appContainer') as HTMLDivElement;
const fileLoader = document.getElementById('fileLoader') as HTMLInputElement;
const selectStart = document.getElementById('selectStart') as HTMLButtonElement;
const selectEnd = document.getElementById('selectEnd') as HTMLButtonElement;

const buttons = new Buttons(selectStart, selectEnd);
const maze = new Maze();
const visualizer = new Visualizer(canvas, container);

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

selectStart.addEventListener('click', () => buttons.selectStart());
selectEnd.addEventListener('click', () => buttons.selectEnd());
