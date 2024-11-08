import { _decorator, Component, instantiate,  Node, Prefab } from 'cc';
import { eventTarget, PATH_SPAWNER } from './Events';
const { ccclass, property } = _decorator;

@ccclass('PathSpawner')
export class PathSpawner extends Component {
    @property(Prefab)
    private pathPrefab: Prefab;
    @property
    private segmentLength: number = 20;
    @property
    private numberOfSegments: number = 10;

    private _pathSegments: Node[] = [];

    start() {
        eventTarget.on(PATH_SPAWNER, e => this.spawnNewPath(e), this);

        for (let i = 0; i < this.numberOfSegments; i++) {
            const segment = this.spawnPathSegment(i * this.segmentLength);
            this._pathSegments.push(segment);
        }
    }

    private spawnPathSegment(zPosition: number): Node {
        const segment = instantiate(this.pathPrefab);
        this.node.addChild(segment);
        segment.setPosition(0, 0, -zPosition);
        return segment;
    }

    private spawnNewPath(playerZ: number) {
        this._pathSegments.forEach(road => {
            if (road.position.z > playerZ + this.segmentLength) {
                road.setPosition(0, 0, road.position.z - (this.numberOfSegments - 1) * this.segmentLength);
            }
        })
    }
}


