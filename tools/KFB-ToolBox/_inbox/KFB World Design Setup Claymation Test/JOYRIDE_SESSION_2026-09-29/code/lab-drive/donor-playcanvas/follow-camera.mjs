import { Vec3, Mat4, Quat, Vec3 as PCVec3 } from 'playcanvas';
import { Script } from 'playcanvas';

/**
 * Follows a target entity with an offset, using smooth interpolation.
 */
export class FollowCamera extends Script {
    /**
     * The target entity to follow.
     * 
     * @attribute
     * @title Target
     * @type {pc.Entity}
     */
    target;

    /**
     * The local space offset with respect to the target entity coordinate system.
     * 
     * @attribute
     * @title Camera Offset
     * @type {Vec3}
     */
    cameraOffset = new Vec3(0, 5, -10);

    /**
     * The amount to lerp the camera towards its desired position every frame based on a 60fps frame rate.
     * Lerping is frame rate independent though and will be correct for other frame rates.
     * 
     * @attribute
     * @title Lerp Amount
     * @type {number}
     * @range [0, 1]
     */
    lerpAmount = 0.1;

    initialize() {
        this.targetPos = new Vec3();
        this.matrix = new Mat4();
        this.quat = new Quat();
        this.vec = new Vec3();

        if (this.target) {
            this.updateTargetPosition();
            this.currentPos = this.targetPos.clone();
        } else {
            this.currentPos = this.entity.getPosition().clone();
        }
    }

    updateTargetPosition() {
        // Calculate the target's angle around the world Y axis
        const forward = this.target.forward;
        this.vec.set(-forward.x, 0, -forward.z).normalize();
        const angle = Math.atan2(this.vec.x, this.vec.z) * 180 / Math.PI;

        // Rebuild the world transform for the target with a rotation limited to the world y axis
        this.quat.setFromEulerAngles(0, angle, 0);
        this.matrix.setTRS(this.target.getPosition(), this.quat, PCVec3.ONE);

        // Calculate the desired camera position in world space
        this.matrix.transformPoint(this.cameraOffset, this.targetPos);
    }

    postUpdate(dt) {
        if (this.target) {
            // Calculate where we want the camera to be
            this.updateTargetPosition();

            // Lerp the current camera position to where we want it to be
            this.currentPos.lerp(this.currentPos, this.targetPos, 1 - Math.pow(1 - this.lerpAmount, dt));

            // Set the camera's position
            this.entity.setPosition(this.currentPos);

            // Look at the target entity from the new position
            this.entity.lookAt(this.target.getPosition());
        }
    }
}