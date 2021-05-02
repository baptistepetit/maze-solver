import '../style/main.css';
import { Buttons } from './views/buttons';
import { DijkstraSolver } from './models/solvers';
import { Maze } from './models/maze';
import { Obj } from './models/obj';
import { Visualizer } from './views/visualizer';

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const container = document.getElementById('appContainer') as HTMLDivElement;
const fileLoader = document.getElementById('fileLoader') as HTMLInputElement;
const selectStart = document.getElementById('selectStart') as HTMLButtonElement;
const selectEnd = document.getElementById('selectEnd') as HTMLButtonElement;

const buttons = new Buttons(selectStart, selectEnd);
const obj = new Obj();
const maze = new Maze();
const visualizer = new Visualizer(canvas, container);
const solver = new DijkstraSolver();
let solution: Map<string, boolean>;

window.addEventListener('load', () => visualizer.init());
window.addEventListener('resize', () => visualizer.resize());

async function loadMaze(file: Blob) {
    solution = null;
    await obj.loadFromFile(file);
    visualizer.loadMaze(obj.raw);
    await maze.buildGraph(obj);
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
        if (maze.startNode !== null) {
            visualizer.setMaterialFromName(maze.startNode, 'None');
        }
        if (pickedFace === maze.endNode) {
            maze.endNode = null;
        }
        maze.startNode = pickedFace;
        visualizer.setMaterialFromName(
            pickedFace,
            'Start'
        );
    } else if (buttons.isSelectingEnd && pickedFace != null) {
        if (maze.endNode !== null) {
            visualizer.setMaterialFromName(maze.endNode, 'None');
        }
        if (pickedFace === maze.startNode) {
            maze.startNode = null;
        }
        maze.endNode = pickedFace;
        visualizer.setMaterialFromName(
            pickedFace,
            'End'
        );
    }

    if (maze.startNode !== null && maze.endNode !== null) {
        solution?.forEach((value, key) => {
            if (key !== maze.startNode && key !==maze.endNode) {
                visualizer.setMaterialFromName(key, 'None');
            }
        });
        solution = solver.solve(maze);
        solution.forEach((value, key) => {
            if (key !== maze.startNode && key !==maze.endNode) {
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
