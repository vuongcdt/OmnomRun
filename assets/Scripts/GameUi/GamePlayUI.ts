import { _decorator, Component, Label, Node } from 'cc';
import { eventTarget, SET_COIN_UI } from '../GamePlay/Events';
const { ccclass, property } = _decorator;

@ccclass('GamePlayUI')
export class GamePlayUI extends Component {
    @property(Label)
    private scoreText: Label;

    start() {
        eventTarget.on(SET_COIN_UI, e => this.setCoinUI(e));
        this.scoreText.string = `0`;
    }

    setCoinUI(score: number) {
        this.scoreText.string = `${score}`;
    }
}


