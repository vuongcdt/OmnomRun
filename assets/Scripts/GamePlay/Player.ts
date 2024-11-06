import { _decorator, Camera, CapsuleCollider, Component, game, ICollisionEvent, Input, input, KeyCode, Node, RigidBody, Vec3 } from 'cc';
import { LaneRoad } from '../Common/Enums';
import { eventTarget, PATH_SPAWNER } from './Events';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Camera)
    private camera: Camera;
    @property
    private forwardSpeed: number = 1;
    @property
    private laneDistance: number = 1;
    @property
    private jumpHeight: number = 10;
    @property
    private slideTime: number = 1000;

    private _currentLane: LaneRoad = LaneRoad.MidlleLane;
    private _isJumping: boolean = false;
    private _isSliding: boolean = false;
    private _rgAvatar: RigidBody;
    private _avatar: Node;
    private _capsuleCollier: CapsuleCollider;
    private _cameraPos: Vec3 = new Vec3();

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._capsuleCollier = this.getComponentInChildren(CapsuleCollider);
        this._capsuleCollier.on('onCollisionEnter', this.onCollisionEnter, this);
        this._capsuleCollier.on('onCollisionExit', this.onCollisionExit, this);
        this._rgAvatar = this.getComponentInChildren(RigidBody);
        this._avatar = this._rgAvatar.node;
        this._rgAvatar.applyImpulse(Vec3.FORWARD);
        this._cameraPos = this.camera.node.position.clone();
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: any) {
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
            case KeyCode.ARROW_LEFT:
                this.changeLane(-1);
                break;
            case KeyCode.ARROW_RIGHT:
                this.changeLane(1);
                break;
            case KeyCode.ARROW_UP:
                this.jump();
                break;
            case KeyCode.ARROW_DOWN:
                this.slide();
                break;
        }
    }

    private changeLane(direction: number) {
        this._currentLane += direction;
        this._currentLane = Math.max(0, Math.min(2, this._currentLane));

        const targetPosition = new Vec3(this._currentLane * this.laneDistance - this.laneDistance, this.node.position.y, this.node.position.z);
        this.node.setPosition(targetPosition);
    }

    private jump() {
        if (this._isJumping) {
            return;
        }

        this._isJumping = true;
        this._rgAvatar.applyImpulse(new Vec3(0, this.jumpHeight));
    }

    private slide() {
        if (this._isSliding || this._isJumping) {
            return;
        }

        this._isSliding = true;
        this._capsuleCollier.cylinderHeight = 0;

        setTimeout(() => {
            this._capsuleCollier.cylinderHeight = 1;
            this._isSliding = false;
        }, this.slideTime);
    }

    update(deltaTime: number) {
        // return;
        this._avatar.angle = 0;
        const newPlayerPos = new Vec3(0, 0, -this.forwardSpeed * deltaTime);
        this.node.translate(newPlayerPos);
        const avatarPos = this._avatar.position;
        const newCamPos = new Vec3(this.node.position.x / 8, avatarPos.y + this._cameraPos.y, this.node.position.z + this._cameraPos.z);
        this.camera.node.setPosition(newCamPos);
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

        if (contactPoint.y >= this._avatar.position.y - this._capsuleCollier.cylinderHeight * 0.5) {
            game.pause();
            console.log('game over');
            return
        }

        this._isJumping = false;
    }
}
