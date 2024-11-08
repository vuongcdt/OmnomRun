import { _decorator, BoxCollider, Collider, Component, ITriggerEvent, Node } from 'cc';
import { Player } from './Player';
import { eventTarget, SET_REDIRECT } from './Events';
const { ccclass, property } = _decorator;

@ccclass('Path')
export class Path extends Component {
    @property(Node)
    private gate: Node;

    private _collider: Collider;

    start() {
        this._collider = this.getComponentInChildren(BoxCollider);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        const player = event.otherCollider.getComponent(Player);

        if (!player) {
            return;
        }

        eventTarget.emit(SET_REDIRECT);
    }

    public setRedirect(isRedirect: boolean) {
        if (isRedirect) {
            this.gate.active = true;
            this._collider.on('onTriggerEnter', this.onTriggerEnter, this);
        } else {
            this.gate.active = false;
        }
    }
}


