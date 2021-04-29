import { Edge3D, Face3D, Point3D, DistanceBetweenFaces } from './geometry';
import { Graph } from './graph';
import { ObjEdge, ObjFace } from './obj';


export class Maze {
    obj: string;
    startFace: string;
    endFace: string;
    graph: Graph;

    constructor(file?: Blob) {
        if (file) {
            this.loadFromFile(file);
        }
        this.startFace = null;
        this.endFace = null;
        this.graph = new Graph();
    }

    private buildGraph(faces: ObjFace[], vertices: Point3D[]): void {
        const edgeCommonFaces = new Map<string, number[]>();
        faces.forEach((face, faceIndex) => {
            const edges = face.getEdges();
            edges.forEach((edge) => {
                if (edgeCommonFaces.has(JSON.stringify(edge))) {
                    edgeCommonFaces.get(JSON.stringify(edge)).push(faceIndex);
                } else {
                    edgeCommonFaces.set(JSON.stringify(edge), [faceIndex]);
                }
            });
        });

        edgeCommonFaces.forEach((contiguousFaceIndices, commonEdge) => {
            if (contiguousFaceIndices.length == 2) {  // else is non-shared or impossible
                const face1: Face3D = {
                    p1: vertices[faces[contiguousFaceIndices[0]].v1],
                    p2: vertices[faces[contiguousFaceIndices[0]].v2],
                    p3: vertices[faces[contiguousFaceIndices[0]].v3],
                };
                if (faces[contiguousFaceIndices[0]].v4) {
                    face1.p4 = vertices[faces[contiguousFaceIndices[0]].v4];
                }
                const face2: Face3D = {
                    p1: vertices[faces[contiguousFaceIndices[1]].v1],
                    p2: vertices[faces[contiguousFaceIndices[1]].v2],
                    p3: vertices[faces[contiguousFaceIndices[1]].v3],
                };
                if (faces[contiguousFaceIndices[1]].v4) {
                    face2.p4 = vertices[faces[contiguousFaceIndices[1]].v4];
                }
                const edgeIndices: ObjEdge = JSON.parse(commonEdge);
                const edge: Edge3D = {
                    p1: vertices[edgeIndices.v1],
                    p2: vertices[edgeIndices.v2],
                };
                const faceName0 = 'Face.' + contiguousFaceIndices[0];
                const faceName1 = 'Face.' + contiguousFaceIndices[1];
                const distance = DistanceBetweenFaces(face1, face2, edge);
                this.graph.addEdge(faceName0, faceName1, distance);
            }
        });
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
    loadFromText(text: string): void {
        this.obj = text;

        const lines = text.split('\n');
        let vertexCount = 0;
        let faceCount = 0;
        const objFaces: ObjFace[] = [];
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
                objFaces[faceCount] = new ObjFace(
                    parseInt(cols[1]) - 1,
                    parseInt(cols[2]) - 1,
                    parseInt(cols[3]) - 1,
                    parseInt(cols[4]) - 1
                );
                faceCount++;
            }
        });

        this.buildGraph(objFaces, vertices);
    }
}
