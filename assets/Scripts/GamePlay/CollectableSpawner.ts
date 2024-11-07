import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec3 } from 'cc';
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

    start() {
        this.spawnerSlopeObstacle(1);

        let time = setInterval(() => {
            const indexX = randomRangeInt(0, 3);

            this.spawnerSlopeObstacle(indexX);
        }, this.timeSpawn * 1000);
    }

    private spawnerSlopeObstacle(index: number) {
        const posX = (1 - index) * 2;
        for (let i = 0; i < 5; i++) {
            const slopeObstacle = instantiate(this.collectable);
            slopeObstacle.position = new Vec3(posX, 0, this.player.position.z - this.distanceObstacle + i * 3);
            slopeObstacle.parent = this.node;
        }
    }
}


