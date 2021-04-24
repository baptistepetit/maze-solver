import { Graph, Node } from '../graph';

export interface Solver {
    solve: (graph: Graph, start: Node, End: Node) => Map<Node, boolean>,
}
