import { _decorator, CapsuleCollider, Component, game, ICollisionEvent, Input, input, ITriggerEvent, KeyCode, math, Node, Quat, RigidBody, v3, Vec3 } from 'cc';
import { LaneRoad } from '../Common/Enums';
import { eventTarget, PATH_SPAWNER } from './Events';
import { Collectable } from './Collectable';
import { angleToQuaternion, rotatePointAroundCenter } from '../Common/Utils';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property
    private forwardSpeed: number = 10;
    @property
    private laneDistance: number = 2;
    @property
    private jumpHeight: number = 10;
    @property
    private slideTime: number = 1;
    @property
    private speedRedirect: number = 1;

    private _targetLane: LaneRoad = LaneRoad.MidlleLane;
    private _isJumping: boolean = false;
    private _isSliding: boolean = false;
    private _rgPlayerAction: RigidBody;
    private _playerAction: Node;
    private _capsuleCollier: CapsuleCollider;
    private _playerPos: Vec3 = new Vec3();

    private _distance: number = -30;

    private _point: Vec3 = new Vec3(0, 0, this._distance);
    private _angle: number = 0;
    private _center: Vec3 = new Vec3(-5, 0, this._distance);

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._capsuleCollier = this.getComponentInChildren(CapsuleCollider);
        this._capsuleCollier.on('onCollisionEnter', this.onCollisionEnter, this);
        this._capsuleCollier.on('onCollisionExit', this.onCollisionExit, this);
        this._rgPlayerAction = this.getComponentInChildren(RigidBody);
        this._playerAction = this._rgPlayerAction.node;
        this._rgPlayerAction.applyImpulse(Vec3.FORWARD);
        this._playerPos = this.node.position;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }


    private redirect() {
        this._angle += this.speedRedirect;
        if (this._angle > 90) {
            game.pause()
            return;
        }

        const rotatedPoint = rotatePointAroundCenter(this._point, this._center, this._angle);
        this.node.position = rotatedPoint;
        this.node.rotate(angleToQuaternion(this.speedRedirect, Vec3.UNIT_Y));
    }

    update(deltaTime: number) {
        if (this._playerPos.z < this._distance) {
            this.redirect();
            return;
        }

        this._playerAction.angle = 0;
        this.node.angle = 0;
        this._playerAction.position.subtract3f(0, 0, this._playerAction.position.z);

        const posX = (this._targetLane - 1) * this.laneDistance;
        const targetPos = new Vec3(posX, this._playerPos.y, this._playerPos.z);
        const distance = Vec3.distance(targetPos, this._playerPos);

        let stepX = targetPos.subtract(this._playerPos).x * deltaTime * 10;

        if (distance < 0.1) {
            stepX = 0;
        }

        const newPlayerPos = new Vec3(stepX, 0, -this.forwardSpeed * deltaTime);
        this.node.translate(newPlayerPos);
    }

    onCollisionExit(event: ICollisionEvent) {
        eventTarget.emit(PATH_SPAWNER, this.node.position.z);
    }

    onCollisionEnter(event: ICollisionEvent) {
        const contacts = event.contacts;

        if (contacts.length == 0) {
            return;
        }

        const contactPoint = new Vec3();
        contacts[0].getWorldPointOnA(contactPoint);

        const isCollisionBody = contactPoint.y >= this._playerAction.position.y + this.node.position.y - this._capsuleCollier.cylinderHeight * 0.5;

        if (isCollisionBody) {
            game.pause();
            console.log('game over', contactPoint);
            return
        }

        this._isJumping = false;
    }


    private onKeyDown(event: any) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.changeLane(-1);
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.changeLane(1);
                break;
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.jump();
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.slide();
                break;
        }
    }

    private changeLane(direction: number) {
        this._targetLane += direction;

        this._targetLane = Math.max(0, Math.min(2, this._targetLane));
    }

    private jump() {
        if (this._isJumping) {
            return;
        }

        this._isJumping = true;
        this._rgPlayerAction.applyImpulse(new Vec3(0, this.jumpHeight));
    }

    private slide() {
        if (this._isSliding) {
            return;
        }

        if (this._isJumping) {
            this._rgPlayerAction.applyImpulse(new Vec3(0, -this.jumpHeight * 1.3));
            return;
        }

        this._isSliding = true;
        this._capsuleCollier.cylinderHeight = 0;

        setTimeout(() => {
            this._capsuleCollier.cylinderHeight = 1;
            this._isSliding = false;
        }, this.slideTime * 1000);
    }
}
