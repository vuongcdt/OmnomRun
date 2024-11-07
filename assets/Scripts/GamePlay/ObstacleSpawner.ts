import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec3 } from 'cc';
import { Obstacle } from './Obstacle';
const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    @property(Prefab)
    private obstacle: Prefab;
    @property(Node)
    private player: Node;
    @property
    private distanceObstacle: number = 50;
    @property
    private timeSpawn: number = 2;
    @property({ type: [Prefab] })
    private avatarObstacles: Prefab[] = [];

    private _obstacles: Obstacle[] = [];

    start() {
        let time = setInterval(() => {
            const indexX = randomRangeInt(0, 3);

            this.spawnerObstacle(indexX);
            // this.spawnerObstacle((indexX + 1) % 3);
            // this.spawnerObstacle((indexX - 1 + 3) % 3);
        }, this.timeSpawn * 1000);
    }

    private spawnerObstacle(index: number) {
        if (!this.obstacle) {
            return;
        }
        const posX = (1 - index) * 3;
        const random = randomRangeInt(0, this.avatarObstacles.length);

        const obstacle = instantiate(this.obstacle);
        obstacle.position = new Vec3(posX, 0, this.player.position.z - this.distanceObstacle);
        obstacle.parent = this.node;

        const avatar = instantiate(this.avatarObstacles[random]);
        obstacle.addChild(avatar);
    }
}


