import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec3 } from 'cc';
import { SlopeObstacle } from './SlopeObstacle';
import { Obstacle } from './Obstacle';
const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    @property(Prefab)
    private slopeObstacle: Prefab;
    @property(Prefab)
    private obstacle: Prefab;
    @property(Node)
    private player: Node;
    @property
    private distanceObstacle: number = 50;
    @property
    private timeSpawn: number = 2;

    private _obstacles: Obstacle[] = [];
    private _count: number = 0;

    start() {
        this.spawnerSlopeObstacle(1);
        this.spawnerObstacle(0);

        let time = setInterval(() => {
            const indexX = randomRangeInt(0, 3);

            this.spawnerSlopeObstacle(indexX);
            this.spawnerObstacle((indexX + 1) % 3);
            this.spawnerObstacle((indexX - 1 + 3) % 3);
            this._count++;
        }, this.timeSpawn * 1000);
    }

    private spawnerSlopeObstacle(index: number) {
        const posX = (1 - index) * 2;
        const slopeObstacle = instantiate(this.slopeObstacle);
        slopeObstacle.position = new Vec3(posX, 0, this.player.position.z - this.distanceObstacle);
        slopeObstacle.parent = this.node;
    }

    private spawnerObstacle(index: number) {
        const posX = (1 - index) * 2;

        const obstacle = instantiate(this.obstacle);
        obstacle.position = new Vec3(posX, 1, this.player.position.z - this.distanceObstacle);
        obstacle.parent = this.node;
    }
}


