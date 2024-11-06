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

    private spawnNewPath(playerZ: number) {
        this._roadSegments.forEach(road => {
            if (road.position.z > playerZ + this.segmentLength) {
                road.setPosition(0, 0, road.position.z - (this.numberOfSegments - 1) * this.segmentLength);
            }
        })
    }
}


