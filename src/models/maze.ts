import { Point3D } from './geometry';

interface ObjFace {
    v1: number,
    v2: number,
    v3: number,
    v4: number,
}

export class Maze {
    obj: string;
    startFace: string;
    endFace: string;

    constructor(file?: Blob) {
        if (file) {
            this.loadFromFile(file);
        }
        this.startFace = null;
        this.endFace = null;
    }

    loadFromFile(file: Blob): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const output = event.target.result.toString();
                this.loadFromText(output);
                resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // TODO: Separate Faces on load
    // TODO: Support Tris
    loadFromText(text: string): void {
        this.obj = text;

        const lines = text.split('\n');
        let vertexCount = 0;
        let faceCount = 0;
        const ObjFaces: ObjFace[] = [];
        const vertices: Point3D[] = [];

        lines.forEach((line) => {
            const cols = line.split(' ');
            if (cols[0] === 'v') {
                vertices[vertexCount] = {
                    x: parseFloat(cols[1]),
                    y: parseFloat(cols[2]),
                    z: parseFloat(cols[3]),
                };
                vertexCount++;
            }

            if (cols[0] === 'f') {
                // Assume all quads for now
                ObjFaces[faceCount] = {
                    v1: parseInt(cols[1]) - 1,
                    v2: parseInt(cols[2]) - 1,
                    v3: parseInt(cols[3]) - 1,
                    v4: parseInt(cols[4]) - 1,
                };
                faceCount++;
            }
        });

        console.log(pathTiles, vertices);
    }
}
