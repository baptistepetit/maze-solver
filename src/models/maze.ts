import {
    Edge3D,
    Face3D,
    distanceBetweenFaces,
} from './geometry';
import {
    Graph,
    Node,
} from './graph';
import {
    Obj,
    ObjEdge,
} from './obj';


export class Maze {
    startNode: Node;
    endNode: Node;
    graph: Graph;

    constructor() {
        this.startNode = null;
        this.endNode = null;
        this.graph = new Graph();
    }

    async buildGraph(obj: Obj): Promise<void> {
        return new Promise<void>((resolve) => {
            const edgeCommonFaces = new Map<string, string[]>();
            obj.objFaces.forEach((face, faceName) => {
                const edges = face.getEdges();
                edges.forEach((edge) => {
                    if (edgeCommonFaces.has(JSON.stringify(edge))) {
                        edgeCommonFaces.get(JSON.stringify(edge)).push(faceName);
                    } else {
                        edgeCommonFaces.set(JSON.stringify(edge), [faceName]);
                    }
                });
            });

            edgeCommonFaces.forEach((contiguousFaces, commonEdge) => {
                if (contiguousFaces.length == 2) {  // else is non-shared or impossible
                    const face0: Face3D = obj.getFace3D(contiguousFaces[0]);
                    const face1: Face3D = obj.getFace3D(contiguousFaces[1]);
                    const edgeIndices: ObjEdge = JSON.parse(commonEdge);
                    const edge: Edge3D = {
                        p1: obj.vertices[edgeIndices.v1],
                        p2: obj.vertices[edgeIndices.v2],
                    };

                    const distance: number = distanceBetweenFaces(face0, face1, edge);
                    this.graph.addEdge(contiguousFaces[0], contiguousFaces[1], distance);
                }
            });

            resolve();
        });
    }
}
