import { _decorator, Component, Node } from 'cc';
import { BaseUI } from './BaseUI';
const { ccclass, property } = _decorator;

@ccclass('GameOverScreen')
export class GameOverScreen extends BaseUI {
    start() {
        this.hide();
    }

    update(deltaTime: number) {

    }
}


