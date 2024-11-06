import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { eventTarget, PATH_SPAWNER } from './Events';
const { ccclass, property } = _decorator;

@ccclass('PathSpawner')
export class PathSpawner extends Component {
    @property(Prefab)
    private roadPrefab: Prefab;
    @property
    private segmentLength: number = 20;
    @property
    private numberOfSegments: number = 10;

    private _roadSegments: Node[] = [];

    start() {
        eventTarget.on(PATH_SPAWNER, e => this.spawnNewPath(e), this);

        for (let i = 0; i < this.numberOfSegments; i++) {
            const segment = this.spawnRoadSegment(i * this.segmentLength);
            this._roadSegments.push(segment);
        }
    }

    private spawnRoadSegment(zPosition: number): Node {
        const segment = instantiate(this.roadPrefab);
        this.node.addChild(segment);
        segment.setPosition(0, 0, -zPosition);
        return segment;
    }

    private spawnNewPath(data) {
        const index = this._roadSegments.indexOf(data);

        const startRoad = this._roadSegments[(this.numberOfSegments + index - 2) % this.numberOfSegments];

        const indexEndRoad = (this.numberOfSegments + index - 3) % this.numberOfSegments;

        const endRoad = this._roadSegments[indexEndRoad];

        startRoad.setPosition(0, 0, endRoad.position.z - this.segmentLength);
    }
}


