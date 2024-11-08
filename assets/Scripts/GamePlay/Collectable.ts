import { _decorator, Collider, Component, Enum, ITriggerEvent, Node } from 'cc';
import { CollectableType } from '../Common/Enums';
import { ADD_COIN, eventTarget } from './Events';
const { ccclass, property } = _decorator;

@ccclass('Collectable')
export class Collectable extends Component {
    private _type: CollectableType = CollectableType.None;
    private _collider: Collider;

    public get type(): CollectableType {
        return this._type;
    }

    public set type(value: CollectableType) {
        this._type = value;
    }

    start() {
        this._collider = this.getComponent(Collider);
        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onTriggerEnter(event: ITriggerEvent) {
        const collectable = event.selfCollider.getComponent(Collectable);

        if (!collectable) {
            return;
        }

        eventTarget.emit(ADD_COIN);
        collectable.node.parent = null;
    }
}


