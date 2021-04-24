export type Node = string;

export interface GraphEdge {
    adjacent: Node,
    weight: number,
}

export class Graph {
    private nodes: Map<Node, GraphEdge[]>;

    constructor() {
        this.nodes = new Map<Node, GraphEdge[]>();
    }

    get order(): number {
        return this.nodes.size;
    }

    addEdge(a: Node, b: Node, weight: number): void {
        const aToB: GraphEdge = {
            adjacent: b,
            weight: weight,
        };
        if (this.nodes.has(a)) {
            this.nodes.get(a).push(aToB);
        } else {
            this.nodes.set(a, [aToB]);
        }
        const bToA: GraphEdge = {
            adjacent: a,
            weight: weight,
        };
        if (this.nodes.has(b)) {
            this.nodes.get(b).push(bToA);
        } else {
            this.nodes.set(b, [bToA]);
        }
    }

    getEdges(node: Node): GraphEdge[] {
        return this.nodes.get(node);
    }

    getNodes(): IterableIterator<Node> {
        return this.nodes.keys();
    }
}
