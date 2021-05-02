import { Maze } from '../maze';
import { Node } from '../graph';

export interface Solver {
    solve: (maze: Maze) => Map<Node, boolean>,
}
