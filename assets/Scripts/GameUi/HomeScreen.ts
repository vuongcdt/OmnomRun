import { _decorator, Component, Node } from 'cc';
import { BaseUI } from './BaseUI';
const { ccclass, property } = _decorator;

@ccclass('HomeScreen')
export class HomeScreen extends BaseUI {
    start() {
        this.hide();
    }

    update(deltaTime: number) {

    }
}


