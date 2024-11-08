import { _decorator, CapsuleCollider, Component, game, ICollisionEvent, Input, input, ITriggerEvent, KeyCode, math, Node, Quat, RigidBody, v3, Vec3 } from 'cc';
import { LaneRoad } from '../Common/Enums';
import { eventTarget, PATH_SPAWNER, SET_REDIRECT } from './Events';
import { Collectable } from './Collectable';
import { angleToQuaternion, getDirX, rotatePointAroundCenter } from '../Common/Utils';
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
    private _distance: number = -50;
    private _angleRedirect: number = 0;
    private _isRedirect: boolean = false;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._capsuleCollier = this.getComponentInChildren(CapsuleCollider);

        this._capsuleCollier.on('onCollisionEnter', this.onCollisionEnter, this);
        this._capsuleCollier.on('onCollisionExit', this.onCollisionExit, this);
        eventTarget.on(SET_REDIRECT, e => this._isRedirect = true);

        this._rgPlayerAction = this.getComponentInChildren(RigidBody);
        this._playerAction = this._rgPlayerAction.node;

        this._rgPlayerAction.applyImpulse(Vec3.FORWARD);
        this._playerPos = this.node.position;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }


    private redirect() {
        this._angleRedirect += this.speedRedirect;
        if (this._targetLane == LaneRoad.MidlleLane) {
            console.log('game over 2');
            game.pause()
            return;
        }

        if (this._angleRedirect > 90) {
            console.log('redirect done');
            this._angleRedirect = 0;
            this._isRedirect = false;
            game.pause();
            return;
        }

        const centerRedirect: Vec3 = new Vec3((1 - this._targetLane) * -5, 0, this._playerPos.z);
        const pointRedirect: Vec3 = new Vec3(0, 0, this._playerPos.z);

        const rotatedPoint = rotatePointAroundCenter(pointRedirect, centerRedirect, this._angleRedirect);
        this.node.position = rotatedPoint;
        const dir = getDirX(pointRedirect, centerRedirect);

        this.node.rotate(angleToQuaternion(dir * this.speedRedirect, Vec3.UNIT_Y));
    }

    update(deltaTime: number) {
        if (this._playerPos.z < this._distance && this._isRedirect && this._angleRedirect <= 90) {
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
