import { _decorator, Component, Input, input, KeyCode, Node, Vec3 } from 'cc';
import { LaneRoad } from '../Common/Enums';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property
    forwardSpeed: number = 1; 
    @property
    laneDistance: number = 1; 
    @property
    jumpHeight: number = 5; 
    @property
    slideDistance: number = 1;
    @property
    slideTime: number = 2000; 

    private currentLane: LaneRoad = LaneRoad.MidlleLane; 
    private isJumping: boolean = false;
    private isSliding: boolean = false;
    private verticalVelocity: number = 0; // Tốc độ theo trục y khi nhảy

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
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
        if (!this.isJumping) {
            this.isJumping = true;
            this.verticalVelocity = this.jumpHeight;
        }
    }

    slide() {
        if (!this.isSliding && !this.isJumping) {
            this.isSliding = true;
            this.node.setPosition(this.node.position.x, this.node.position.y - this.slideDistance, this.node.position.z);
            
            setTimeout(() => {
                this.node.setPosition(this.node.position.x, this.node.position.y + this.slideDistance, this.node.position.z);
                this.isSliding = false;
            }, this.slideTime); 
        }
    }

    update(deltaTime: number) {
        this.node.translate(new Vec3(0, 0, -this.forwardSpeed * deltaTime));

        if (this.isJumping) {
            this.node.setPosition(this.node.position.x, this.node.position.y + this.verticalVelocity * deltaTime, this.node.position.z);
            this.verticalVelocity -= 20 * deltaTime;

            if (this.node.position.y < 0) {
                this.node.setPosition(this.node.position.x, 0, this.node.position.z);
                this.isJumping = false;
                this.verticalVelocity = 0;
            }
        }
    }
}
