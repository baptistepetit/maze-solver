import { Edge3D, Face3D, Point3D, DistanceBetweenFaces } from './geometry';
import { Graph } from './graph';

interface ObjEdge {
    v1: number,
    v2: number,
}

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
    graph: Graph;

    constructor(file?: Blob) {
        if (file) {
            this.loadFromFile(file);
        }
        this.startFace = null;
        this.endFace = null;
        this.graph = new Graph();
    }

    // Completely arbitrary function to ensure consistent
    // equality after stringification
    private orderEdge(edge: ObjEdge): ObjEdge {
        if (edge.v1 < edge.v2) {
            return edge;
        } else {
            return { v1: edge.v2, v2: edge.v1 };
        }
    }

    private buildGraph(faces: ObjFace[], vertices: Point3D[]): void {
        const edgeCommonFaces = new Map<string, number[]>();
        faces.forEach((face, faceIndex) => {
            const edges: ObjEdge[] = [];
            // Assume all quads for now
            edges.push({v1: face.v1, v2: face.v2});
            edges.push({v1: face.v2, v2: face.v3});
            edges.push({v1: face.v3, v2: face.v4});
            edges.push({v1: face.v4, v2: face.v1});

            edges.forEach((edge) => {
                if (edgeCommonFaces.has(JSON.stringify(this.orderEdge(edge)))) {
                    edgeCommonFaces.get(JSON.stringify(this.orderEdge(edge))).push(faceIndex);
                } else {
                    edgeCommonFaces.set(JSON.stringify(this.orderEdge(edge)), [faceIndex]);
                }
            });
        });

        edgeCommonFaces.forEach((value, key) => {
            if (value.length == 2) {  // else is non-shared or impossible
                const face1: Face3D = {
                    p1: vertices[faces[value[0]].v1],
                    p2: vertices[faces[value[0]].v2],
                    p3: vertices[faces[value[0]].v3],
                    p4: vertices[faces[value[0]].v4],
                };
                const face2: Face3D = {
                    p1: vertices[faces[value[1]].v1],
                    p2: vertices[faces[value[1]].v2],
                    p3: vertices[faces[value[1]].v3],
                    p4: vertices[faces[value[1]].v4],
                };
                const edgeIndices: ObjEdge = JSON.parse(key);
                const commonEdge: Edge3D = {
                    p1: vertices[edgeIndices.v1],
                    p2: vertices[edgeIndices.v2],
                };
                const faceName0 = 'Face.' + value[0];
                const faceName1 = 'Face.' + value[1];
                const distance = DistanceBetweenFaces(face1, face2, commonEdge);
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

        this.buildGraph(ObjFaces, vertices);
    }
}
