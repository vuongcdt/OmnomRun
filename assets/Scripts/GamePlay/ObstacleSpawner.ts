import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec3 } from 'cc';
import { SlopeObstacle } from './SlopeObstacle';
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

    private _slopeObstacles: SlopeObstacle[] = [];
    private _type: number = 0;
    private _count: number = 0;

    start() {
        this.spawnerSlopeObstacle();
        this.spawnerObstacle();

        let time = setInterval(() => {
            this.spawnerSlopeObstacle();
            this.spawnerObstacle();
            this._count++;
        }, this.timeSpawn * 1000);
    }

    private spawnerSlopeObstacle() {
        const randomX = (1 - randomRangeInt(0, 3)) * 2;
        const slopeObstacle = instantiate(this.slopeObstacle);
        slopeObstacle.position = new Vec3(randomX, 0, this.player.position.z - this.distanceObstacle);
        slopeObstacle.parent = this.node;
    }

    private spawnerObstacle() {
        const randomX = (1 - randomRangeInt(0, 3)) * 2;
        const obstacle = instantiate(this.obstacle);
        obstacle.position = new Vec3(randomX, 1, this.player.position.z - this.distanceObstacle);
        obstacle.parent = this.node;
    }
}


