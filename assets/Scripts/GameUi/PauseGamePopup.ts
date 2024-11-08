import { _decorator, Component, Node } from 'cc';
import { BaseUI } from './BaseUI';
const { ccclass, property } = _decorator;

@ccclass('PauseGamePopup')
export class PauseGamePopup extends BaseUI {
    start() {
        this.hide();
    }

    update(deltaTime: number) {
        
    }
}


