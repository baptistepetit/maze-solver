import '../style/main.css';
import { Visualizer } from './views/visualizer';
import { Maze } from './models/maze';
import { DijkstraSolver } from './models/solvers';
import { Buttons } from './views/buttons';

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const container = document.getElementById('appContainer') as HTMLDivElement;
const fileLoader = document.getElementById('fileLoader') as HTMLInputElement;
const selectStart = document.getElementById('selectStart') as HTMLButtonElement;
const selectEnd = document.getElementById('selectEnd') as HTMLButtonElement;

const buttons = new Buttons(selectStart, selectEnd);
const maze = new Maze();
const visualizer = new Visualizer(canvas, container);
const solver = new DijkstraSolver();

window.addEventListener('load', () => visualizer.init());
window.addEventListener('resize', () => visualizer.resize());

async function loadMaze(file: Blob) {
    await maze.loadFromFile(file);
    visualizer.loadMaze(maze.obj);
}

function getPointerPosition(event: PointerEvent) {
    const canvasLocation = canvas.getBoundingClientRect();
    return {
        x: -1 + 2 * (event.clientX - canvasLocation.left) / canvas.clientWidth,
        y:  1 - 2 * (event.clientY - canvasLocation.top) / canvas.clientHeight,
    };
}

function selectFace(event: PointerEvent) {
    const pickedFace = visualizer.pick(
        getPointerPosition(event)
    );

    if (buttons.isSelectingStart && pickedFace != null) {
        if (maze.startFace !== null) {
            visualizer.setMaterialFromName(maze.startFace, 'None');
        }
        if (pickedFace === maze.endFace) {
            maze.endFace = null;
        }
        maze.startFace = pickedFace;
        visualizer.setMaterialFromName(
            pickedFace,
            'Start'
        );
    } else if (buttons.isSelectingEnd && pickedFace != null) {
        if (maze.endFace !== null) {
            visualizer.setMaterialFromName(maze.endFace, 'None');
        }
        if (pickedFace === maze.startFace) {
            maze.startFace = null;
        }
        maze.endFace = pickedFace;
        visualizer.setMaterialFromName(
            pickedFace,
            'End'
        );
    }

    if (maze.startFace !== null && maze.endFace !== null) {
        // TODO: Clean previous path material
        const solution = solver.solve(maze.graph, maze.startFace, maze.endFace);
        solution.forEach((value, key) => {
            if (key !== maze.startFace && key !==maze.endFace) {
                visualizer.setMaterialFromName(key, 'Path');
            }
        });
    }
}

fileLoader.addEventListener('change', (event) => {
    const eventTarget = event.target as HTMLInputElement;
    const file = eventTarget.files[0];
    loadMaze(file);
});

selectStart.addEventListener('click', () => buttons.selectStart());
selectEnd.addEventListener('click', () => buttons.selectEnd());

canvas.addEventListener('pointerdown', (event) => selectFace(event));
