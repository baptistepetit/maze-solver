export interface Point3D {
    x: number,
    y: number,
    z: number,
}

export interface Edge3D {
    p1: Point3D,
    p2: Point3D,
}

export class Face3D {
    public p1: Point3D;
    public p2: Point3D;
    public p3: Point3D;
    public p4: Point3D;

    constructor (p1: Point3D, p2: Point3D, p3: Point3D, p4?: Point3D) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4 ? p4 : null;
    }
}

function distanceCenterToEdge(face: Face3D, edge: Edge3D): number {
    const edgeMiddle: Point3D = {
        x: (edge.p1.x + edge.p2.x) / 2,
        y: (edge.p1.y + edge.p2.y) / 2,
        z: (edge.p1.z + edge.p2.z) / 2
    };

    // Presuppose Planar Convex Oriented Quads or Triangles
    const weight = face.p4 ? 4 : 3;
    const faceCentroid: Point3D = {
        x: (face.p1.x + face.p2.x + face.p3.x) / weight,
        y: (face.p1.y + face.p2.y + face.p3.y) / weight,
        z: (face.p1.z + face.p2.z + face.p3.z) / weight
    };
    if (face.p4) {
        faceCentroid.x += face.p4.x / weight;
        faceCentroid.y += face.p4.y / weight;
        faceCentroid.z += face.p4.z / weight;
    }

    return Math.sqrt(
        (edgeMiddle.x - faceCentroid.x) * (edgeMiddle.x - faceCentroid.x)
        + (edgeMiddle.y - faceCentroid.y) * (edgeMiddle.y - faceCentroid.y)
        + (edgeMiddle.z - faceCentroid.z) * (edgeMiddle.z - faceCentroid.z)
    );
}

export function DistanceBetweenFaces(f1: Face3D, f2: Face3D, commonEdge: Edge3D): number {
    return distanceCenterToEdge(f1, commonEdge) + distanceCenterToEdge(f2, commonEdge);
}
