import { _decorator, Component, Node } from 'cc';
import { ADD_COIN, eventTarget, SET_COIN_UI as SET_COIN_UI } from './GamePlay/Events';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private _coin: number = 0;

    start() {
        eventTarget.on(ADD_COIN, e => this.addCoin());
    }

    private addCoin() {
        this._coin++;
        eventTarget.emit(SET_COIN_UI, this._coin);
    }
}


