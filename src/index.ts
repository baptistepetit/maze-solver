import '../style/main.css';
import { View } from './view';

const container = document.getElementById('appContainer') as HTMLDivElement;
const canvas = document.getElementById('scene') as HTMLCanvasElement;

const view = new View(canvas, container);

window.addEventListener('load', () => view.init());
window.addEventListener('resize', () => view.resize());
