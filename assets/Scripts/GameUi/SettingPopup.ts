import { _decorator, Component, Node } from 'cc';
import { BaseUI } from './BaseUI';
const { ccclass, property } = _decorator;

@ccclass('SettingPopup')
export class SettingPopup extends BaseUI {
    start() {
        this.hide();
    }

    update(deltaTime: number) {
        
    }
}


