import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseUI')
export class BaseUI extends Component {

    protected show() {
        this.node.active = true;
    }

    protected hide() {
        this.node.active = false;
    }

}


