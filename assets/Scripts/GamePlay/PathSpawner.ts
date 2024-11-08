import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt } from 'cc';
import { eventTarget, PATH_SPAWNER } from './Events';
import { Path } from './Path';
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
    private _paths: Path[] = [];

    start() {
        eventTarget.on(PATH_SPAWNER, e => this.spawnNewPath(e), this);

        for (let i = 0; i < this.numberOfSegments; i++) {
            const segment = this.spawnPathSegment(i * this.segmentLength);
            const path = segment.getComponent(Path);
            path.setRedirect(false);
            this._pathSegments.push(segment);
            this._paths.push(path);
        }
    }

    private spawnPathSegment(zPosition: number): Node {
        const segment = instantiate(this.pathPrefab);
        this.node.addChild(segment);
        segment.setPosition(0, 0, -zPosition);
        return segment;
    }

    private spawnNewPath(playerZ: number) {
        this._pathSegments.forEach((path, index) => {
            if (path.position.z < playerZ + this.segmentLength) {
                return;
            }

            path.setPosition(0, 0, path.position.z - (this.numberOfSegments - 1) * this.segmentLength);
            if (playerZ < -100) {
                const random = randomRangeInt(0, 5);
                this._paths[index].setRedirect(random == 0);
            }
        })
    }
}


