import { Face3D, Point3D } from './geometry';

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

export class Obj {
    raw: string;
    objFaces: Map<string, ObjFace>;
    vertices: Point3D[];

    private separateFaces (text: string): string {
        let processed = '';
        let faceCount = 0;
        const lines = text.split('\n');

        lines.forEach(line => {
            const cols = line.split(' ');

            if (cols[0] !== 'o' && cols[0] !== 's') {
                if (cols[0] === 'f') {
                    processed += 'o Face.' + faceCount + '\n';
                    faceCount++;
                }
                processed += (line + '\n');
            }
        });

        return processed;
    }

    getFace3D (faceName: string): Face3D {
        if (this.objFaces.has(faceName)) {
            const faceObj = this.objFaces.get(faceName);
            return new Face3D(
                this.vertices[faceObj.v1],
                this.vertices[faceObj.v2],
                this.vertices[faceObj.v3],
                this.vertices[faceObj.v4],
            );
        }
        return null;
    }

    loadFromFile (file: Blob): Promise<void> {
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

    loadFromText (text: string): void {
        this.raw = this.separateFaces(text);

        const lines = this.raw.split('\n');
        let vertexCount = 0;
        let faceCount = 0;
        this.objFaces = new Map<string, ObjFace>();
        this.vertices = [];

        lines.forEach((line) => {
            const cols = line.split(' ');
            if (cols[0] === 'v') {
                this.vertices[vertexCount] = {
                    x: parseFloat(cols[1]),
                    y: parseFloat(cols[2]),
                    z: parseFloat(cols[3]),
                };
                vertexCount++;
            }

            if (cols[0] === 'f') {
                this.objFaces.set(
                    'Face.' + faceCount,
                    new ObjFace(
                        parseInt(cols[1]) - 1,
                        parseInt(cols[2]) - 1,
                        parseInt(cols[3]) - 1,
                        parseInt(cols[4]) - 1
                    )
                );
                faceCount++;
            }
        });
    }
}
