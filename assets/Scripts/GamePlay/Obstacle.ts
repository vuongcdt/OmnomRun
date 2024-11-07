import { _decorator, ccenum, Component, Enum, Node } from 'cc';
import { ObstacleType } from '../Common/Enums';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {
    @property({ type: Enum(ObstacleType) })
    private type: ObstacleType;

    start() {

    }

    update(deltaTime: number) {

    }
}


