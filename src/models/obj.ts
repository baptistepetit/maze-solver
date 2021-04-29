export class ObjEdge {
    public v1: number;
    public v2: number;

    constructor (v1: number, v2: number) {
        // Completely arbitrary ordering to ensure consistent
        // equality after stringification
        if (v1 < v2) {
            this.v1 = v1;
            this.v2 = v2;
        } else {
            this.v1 = v2;
            this.v2 = v1;
        }
    }
}

export class ObjFace {
    public v1: number;
    public v2: number;
    public v3: number;
    public v4: number;

    constructor (v1: number, v2: number, v3: number, v4?: number) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4 ? v4 : null;
    }

    getEdges(): ObjEdge[] {
        const edges: ObjEdge[] = [];

        if (this.v4) {
            edges.push(new ObjEdge(this.v1, this.v2));
            edges.push(new ObjEdge(this.v2, this.v3));
            edges.push(new ObjEdge(this.v3, this.v4));
            edges.push(new ObjEdge(this.v4, this.v1));
        } else {
            edges.push(new ObjEdge(this.v1, this.v2));
            edges.push(new ObjEdge(this.v2, this.v3));
            edges.push(new ObjEdge(this.v3, this.v1));
        }

        return edges;
    }
}
