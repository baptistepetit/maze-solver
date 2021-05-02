import {
    Edge3D,
    Face3D,
    distanceBetweenFaces,
} from './geometry';
import {
    Obj,
    ObjEdge,
} from './obj';
import { Graph } from './graph';


export class Maze {
    startFace: string;
    endFace: string;
    graph: Graph;

    constructor() {
        this.startFace = null;
        this.endFace = null;
        this.graph = new Graph();
    }

    async buildGraph(obj: Obj): Promise<void> {
        return new Promise<void>((resolve) => {
            const edgeCommonFaces = new Map<string, number[]>();
            obj.objFaces.forEach((face, faceIndex) => {
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
                    const face0 = new Face3D(
                        obj.vertices[obj.objFaces[contiguousFaceIndices[0]].v1],
                        obj.vertices[obj.objFaces[contiguousFaceIndices[0]].v2],
                        obj.vertices[obj.objFaces[contiguousFaceIndices[0]].v3],
                        obj.vertices[obj.objFaces[contiguousFaceIndices[0]].v4],
                    );
                    const face1 = new Face3D(
                        obj.vertices[obj.objFaces[contiguousFaceIndices[1]].v1],
                        obj.vertices[obj.objFaces[contiguousFaceIndices[1]].v2],
                        obj.vertices[obj.objFaces[contiguousFaceIndices[1]].v3],
                        obj.vertices[obj.objFaces[contiguousFaceIndices[1]].v4],
                    );
                    const edgeIndices: ObjEdge = JSON.parse(commonEdge);
                    const edge: Edge3D = {
                        p1: obj.vertices[edgeIndices.v1],
                        p2: obj.vertices[edgeIndices.v2],
                    };

                    const distance = distanceBetweenFaces(face0, face1, edge);
                    this.graph.addEdge(obj.objFaces[contiguousFaceIndices[0]].name, obj.objFaces[contiguousFaceIndices[1]].name, distance);
                }
            });

            resolve();
        });
    }
}
