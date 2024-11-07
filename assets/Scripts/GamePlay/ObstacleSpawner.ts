import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Obstacle } from './Obstacle';
import { eventTarget, OBSTACLE_SPAWNER, PATH_SPAWNER } from './Events';
const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    @property(Prefab)
    private obstaclePrefab: Prefab;
    @property(Node)
    private player: Node;

    private _obstacles: Obstacle[] = [];
    private _type: number = 0;
    private _count: number = 0;

    start() {
        // eventTarget.on(OBSTACLE_SPAWNER, e => this.spawnerObstacle(e), this);
        this.spawnerObstacle();
        let time = setInterval(() => {
            this.spawnerObstacle();
            this._count++;
            if (this._count > 10) {
                clearInterval(time);
            }
        }, 2000);
    }

    private spawnerObstacle() {
        console.log('init');

        const obstacle = instantiate(this.obstaclePrefab);
        obstacle.position = new Vec3(0, 0, this.player.position.z - 25);
        obstacle.parent = this.node;
    }

    // private spawnerObstacle(posZPlayer: number) {
    //     console.log('init');

    //     const obstacle = instantiate(this.obstaclePrefab);
    //     obstacle.position = new Vec3(0, 0, posZPlayer - 25);
    //     obstacle.parent = this.node;
    // }
}


