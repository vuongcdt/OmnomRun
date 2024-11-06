import { _decorator, Camera, CapsuleCollider, Component, game, ICollisionEvent, Input, input, KeyCode, MeshRenderer, Node, RigidBody, tween, Vec3 } from 'cc';
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
    private _offsetCameraPos: Vec3 = new Vec3();
    private _image: Node;
    private _playerPos: Vec3 = new Vec3();
    private _avatarPos: Vec3 = new Vec3();
    private _timeChangeLane: number = 0.5;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._capsuleCollier = this.getComponentInChildren(CapsuleCollider);
        this._capsuleCollier.on('onCollisionEnter', this.onCollisionEnter, this);
        this._capsuleCollier.on('onCollisionExit', this.onCollisionExit, this);
        this._rgAvatar = this.getComponentInChildren(RigidBody);
        this._avatar = this._rgAvatar.node;
        this._image = this.getComponentInChildren(MeshRenderer).node;
        this._rgAvatar.applyImpulse(Vec3.FORWARD);
        this._offsetCameraPos = this.camera.node.position.clone();
        this._playerPos = this.node.position;
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

        if (this._currentLane >= 0 && this._currentLane <= 2) {
            this._image.setPosition(new Vec3(-2 * direction, 0));
            tween(this._image)
                .to(this._timeChangeLane, { position: new Vec3(0, 0) }, { easing: 'quadOut' })
                .start();
        }
        this._currentLane = Math.max(0, Math.min(2, this._currentLane));

        const targetPosition = new Vec3(this._currentLane * this.laneDistance - this.laneDistance, this._playerPos.y, this._playerPos.z);
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
        if (this._isSliding) {
            return;
        }
        if (this._isJumping) {
            this._rgAvatar.applyImpulse(new Vec3(0, -this.jumpHeight * 1.3));
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
        this._avatar.angle = 0;
        const newPlayerPos = new Vec3(0, 0, -this.forwardSpeed * deltaTime);
        this.node.translate(newPlayerPos);
        this._avatarPos = this._avatar.position;
        const newCamPos = new Vec3(this._playerPos.x + this._image.position.x, this._avatarPos.y + this._offsetCameraPos.y, this._playerPos.z + this._offsetCameraPos.z);
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

        if (contactPoint.y >= this._avatarPos.y - this._capsuleCollier.cylinderHeight * 0.5) {
            game.pause();
            console.log('game over');
            return
        }

        this._isJumping = false;
    }
}
