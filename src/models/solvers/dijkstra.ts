import { Solver } from './solver';
import { Graph, Node } from '../graph';

export class DijkstraSolver implements Solver {
    solve(graph: Graph, start: Node, end: Node): Map<Node, boolean> {
        const solution = new Map<Node, boolean>();
        const distanceToStart = new Map<Node, {shortestDistance: number, previousNode: Node}>();
        const visited = new Map<Node, boolean>();
        const unvisited = new Map<Node, boolean>();

        // Init
        for (const node of graph.getNodes()) {
            unvisited.set(node, true);
            distanceToStart.set(node, { shortestDistance: Infinity, previousNode: null });
        }
        distanceToStart.set(start, { shortestDistance: 0, previousNode: null });

        // Greedy Solving
        while (!visited.has(end)) {
            let globalShortestDistance = Infinity;
            let currentNode: Node = null;
            distanceToStart.forEach((value, key) => {
                if ((value.shortestDistance < globalShortestDistance) &&
                    (!visited.has(key))) {
                    globalShortestDistance = value.shortestDistance;
                    currentNode = key;
                }
            });

            graph.getEdges(currentNode).forEach((contiguousNode) => {
                const updatedDistance = globalShortestDistance + contiguousNode.weight;
                if (updatedDistance < distanceToStart.get(contiguousNode.adjacent).shortestDistance) {
                    distanceToStart.set(contiguousNode.adjacent, { shortestDistance: updatedDistance, previousNode: currentNode });
                }
            });

            visited.set(currentNode, true);
            unvisited.delete(currentNode);
        }

        // Bactracking the solution
        let pathNode = end;
        while (pathNode != start) {
            solution.set(pathNode, true);
            pathNode = distanceToStart.get(pathNode).previousNode;
        }
        solution.set(start, true);

        return solution;
    }
}
