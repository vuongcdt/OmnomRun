import { _decorator, CapsuleCollider, Component, ICollisionEvent, Input, input, KeyCode, Node, RigidBody, Vec3 } from 'cc';
import { LaneRoad } from '../Common/Enums';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property
    forwardSpeed: number = 1;
    @property
    laneDistance: number = 1;
    @property
    jumpHeight: number = 10;
    @property
    slideDistance: number = 1;
    @property
    slideTime: number = 2000;

    private currentLane: LaneRoad = LaneRoad.MidlleLane;
    private isJumping: boolean = false;
    private isSliding: boolean = false;
    private _rgAvatar: RigidBody;
    private _avatar: Node;
    private _capsuleCollier: CapsuleCollider;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._capsuleCollier = this.getComponentInChildren(CapsuleCollider);
        this._capsuleCollier.on('onCollisionEnter', this.onCollisionEnter, this);
        this._rgAvatar = this.getComponentInChildren(RigidBody);
        this._avatar = this._rgAvatar.node;
        this._rgAvatar.applyImpulse(Vec3.FORWARD);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: any) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.changeLane(-1);
                break;
            case KeyCode.KEY_D:
                this.changeLane(1);
                break;
            case KeyCode.KEY_W:
                this.jump();
                break;
            case KeyCode.KEY_S:
                this.slide();
                break;
        }
    }

    changeLane(direction: number) {
        this.currentLane += direction;
        this.currentLane = Math.max(0, Math.min(2, this.currentLane));

        const targetPosition = new Vec3(this.currentLane * this.laneDistance - this.laneDistance, this.node.position.y, this.node.position.z);
        this.node.setPosition(targetPosition);
    }

    jump() {
        if (this.isJumping) {
            return;
        }
        this.isJumping = true;
        this._rgAvatar.applyImpulse(Vec3.UP.clone().multiplyScalar(this.jumpHeight));
    }

    slide() {
        if (this.isSliding || this.isJumping) {
            return;
        }

        this.isSliding = true;
        this._capsuleCollier.cylinderHeight = 0;

        setTimeout(() => {
            this._capsuleCollier.cylinderHeight = 1;
            this.isSliding = false;
        }, this.slideTime);
    }

    update(deltaTime: number) {
        this._avatar.angle = 0;
        this.node.translate(new Vec3(0, 0, -this.forwardSpeed * deltaTime));
    }

    onCollisionEnter(event: ICollisionEvent) {
        const contacts = event.contacts;

        if (contacts.length == 0) {
            return;
        }
        const contactPoint = new Vec3();
        contacts[0].getWorldPointOnA(contactPoint);

        if (contactPoint.y >= this._avatar.position.y - this._capsuleCollier.cylinderHeight * 0.5) {
            return
        }

        this.isJumping = false;
    }
}
