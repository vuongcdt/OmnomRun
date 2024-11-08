import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec3 } from 'cc';
import { COLLECTABLE_SPAWNER, eventTarget } from './Events';
import { Collectable } from './Collectable';
import { CollectableType } from '../Common/Enums';
const { ccclass, property } = _decorator;

@ccclass('CollectableSpawner')
export class CollectableSpawner extends Component {
    @property(Prefab)
    private collectable: Prefab;
    @property(Node)
    private player: Node;
    @property
    private distanceObstacle: number = 50;
    @property
    private timeSpawn: number = 2;

    private _collectables: Node[] = [];

    start() {
        eventTarget.on(COLLECTABLE_SPAWNER, e => this.spawnerCollectable());
        this.spawnerCollectable();

        let time = setInterval(() => {
            this.spawnerCollectable();
        }, this.timeSpawn * 1000);
    }

    private spawnerCollectable() {
        const index = randomRangeInt(0, 3);

        const posX = (1 - index) * 3;
        for (let i = 0; i < 5; i++) {
            const collectable = instantiate(this.collectable);
            collectable.position = new Vec3(posX, 0, this.player.position.z - this.distanceObstacle + i * 3);
            collectable.parent = this.node;
            collectable.getComponent(Collectable).type = CollectableType.Coin;
            
            this._collectables.push(collectable);
        }
    }
}


