import { Script, math, Entity, platform } from 'playcanvas';
import { XRHAND_LEFT, XRHAND_RIGHT, KEY_A, KEY_D, KEY_W, KEY_S, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN } from 'playcanvas';


/**
 * Handles vehicle physics using Ammo's RaycastVehicle.
 */
export class Vehicle extends Script {
    /**
     * List of wheel entities with the `VehicleWheel` script attached.
     * @type {pc.Entity[]}
     * @attribute
     */
    wheels;

    /** @type {number} @attribute */
    maxEngineForce = 2000;

    /** @type {number} @attribute */
    maxBrakingForce = 100;

    /** @type {number} @attribute */
    maxSteering = 0.3;

    get speed() {
        return this.vehicle ? this.vehicle.getCurrentSpeedKmHour() : 0;
    }

    postInitialize() {
        const body = this.entity.rigidbody.body;
        const dynamicsWorld = this.app.systems.rigidbody.dynamicsWorld;

        const tuning = new Ammo.btVehicleTuning();
        const rayCaster = new Ammo.btDefaultVehicleRaycaster(dynamicsWorld);
        const vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
        vehicle.setCoordinateSystem(0, 1, 2);

        const DISABLE_DEACTIVATION = 4;
        body.setActivationState(DISABLE_DEACTIVATION);

        const axle = new Ammo.btVector3(-1, 0, 0);
        const direction = new Ammo.btVector3(0, -1, 0);
        const connection = new Ammo.btVector3(0, 0, 0);
        const tmpArr = [];

        this.wheels.forEach((wheelEntity) => {
            const ws = wheelEntity.script.vehicleWheel;
            wheelEntity.getLocalPosition().toArray(tmpArr)

            connection.setValue(...tmpArr);
            const info = vehicle.addWheel(connection, direction, axle, ws.suspensionRestLength, ws.radius, tuning, ws.isFront);

            info.set_m_suspensionStiffness(ws.suspensionStiffness);
            info.set_m_wheelsDampingRelaxation(ws.suspensionDamping);
            info.set_m_wheelsDampingCompression(ws.suspensionCompression);
            info.set_m_frictionSlip(ws.frictionSlip);
            info.set_m_rollInfluence(ws.rollInfluence);
        });

        Ammo.destroy(axle);
        Ammo.destroy(direction);
        Ammo.destroy(connection);

        dynamicsWorld.addAction(vehicle);

        this.vehicle = vehicle;
        this.engineForce = 0;
        this.brakingForce = 0;
        this.steering = 0;

        this.on('enable', () => dynamicsWorld.addAction(vehicle));
        this.on('disable', () => dynamicsWorld.removeAction(vehicle));
        this.on('destroy', () => {
            dynamicsWorld.removeAction(vehicle);
            Ammo.destroy(rayCaster);
            Ammo.destroy(vehicle);
        });

        this.on('vehicle:controls', (steer, throttle) => {
            this.steering = math.lerp(this.steering, steer * this.maxSteering, 0.3);
            if (throttle > 0) {
                this.brakingForce = 0;
                this.engineForce = this.maxEngineForce;
            } else if (throttle < 0) {
                this.brakingForce = 0;
                this.engineForce = -this.maxEngineForce;
            } else {
                this.brakingForce = this.maxBrakingForce;
                this.engineForce = 0;
            }
        });
    }

    update() {
        const v = this.vehicle;

        v.setSteeringValue(this.steering, 0);
        v.setSteeringValue(this.steering, 1);
        v.applyEngineForce(this.engineForce, 2);
        v.setBrake(this.brakingForce, 2);
        v.applyEngineForce(this.engineForce, 3);
        v.setBrake(this.brakingForce, 3);

        for (let i = 0; i < v.getNumWheels(); i++) {
            v.updateWheelTransform(i, true);
            const t = v.getWheelTransformWS(i);
            const p = t.getOrigin();
            const q = t.getRotation();
            const wheel = this.wheels[i];
            wheel.setPosition(p.x(), p.y(), p.z());
            wheel.setRotation(q.x(), q.y(), q.z(), q.w());
        }
    }
}

/**
 * Defines physical properties of a vehicle wheel used by Vehicle script.
 */
export class VehicleWheel extends Script {
    /** @type {boolean} @attribute */
    isFront = true;

    /** @type {number} @attribute */
    radius = 0.4;

    /** @type {number} @attribute */
    width = 0.4;

    /** @type {number} @attribute */
    suspensionStiffness = 10;

    /** @type {number} @attribute */
    suspensionDamping = 2.3;

    /** @type {number} @attribute */
    suspensionCompression = 4.4;

    /** @type {number} @attribute */
    suspensionRestLength = 0.2;

    /** @type {number} @attribute */
    rollInfluence = 0.2;

    /** @type {number} @attribute */
    frictionSlip = 1000;

    /** @type {boolean} @attribute */
    debugRender = false;

    initialize() {
        const createDebugWheel = (radius, width) => {
            const e = new Entity();
            e.addComponent('model', { type: 'cylinder', castShadows: true });
            e.setLocalEulerAngles(0, 0, 90);
            e.setLocalScale(radius * 2, width, radius * 2);
            return e;
        };

        if (this.debugRender) {
            this.debugWheel = createDebugWheel(this.radius, this.width);
            this.entity.addChild(this.debugWheel);
        }

        this.on('attr:debugRender', (value) => {
            if (value) {
                this.debugWheel = createDebugWheel(this.radius, this.width);
                this.entity.addChild(this.debugWheel);
            } else if (this.debugWheel) {
                this.debugWheel.destroy();
                this.debugWheel = null;
            }
        });
    }
}


/**
 * UI + keyboard + WebXR input handler for controlling a vehicle entity.
 */
export class VehicleControls extends Script {
    /** @type {import('playcanvas').Entity} @attribute */
    targetVehicle;

    /** @type {import('playcanvas').Entity} @attribute */
    leftButton;
    rightButton;
    forwardButton;
    reverseButton;

    initialize() {
        this.leftButtonPressed = this.rightButtonPressed = false;
        this.upButtonPressed = this.downButtonPressed = false;
        this.leftKeyPressed = this.rightKeyPressed = false;
        this.upKeyPressed = this.downKeyPressed = false;

        const setupButton = (btn, stateProp) => {
            if (!btn) return;
            btn.enabled = platform.mobile;
            btn.button.on('pressedstart', () => this[stateProp] = true);
            btn.button.on('pressedend', () => this[stateProp] = false);
        };

        setupButton(this.leftButton, 'leftButtonPressed');
        setupButton(this.rightButton, 'rightButtonPressed');
        setupButton(this.forwardButton, 'upButtonPressed');
        setupButton(this.reverseButton, 'downButtonPressed');

        this.app.keyboard.on('keydown', (e) => {
            switch (e.key) {
                case KEY_A: case KEY_LEFT: this.leftKeyPressed = true; break;
                case KEY_D: case KEY_RIGHT: this.rightKeyPressed = true; break;
                case KEY_W: case KEY_UP: this.upKeyPressed = true; break;
                case KEY_S: case KEY_DOWN: this.downKeyPressed = true; break;
            }
        });

        this.app.keyboard.on('keyup', (e) => {
            switch (e.key) {
                case KEY_A: case KEY_LEFT: this.leftKeyPressed = false; break;
                case KEY_D: case KEY_RIGHT: this.rightKeyPressed = false; break;
                case KEY_W: case KEY_UP: this.upKeyPressed = false; break;
                case KEY_S: case KEY_DOWN: this.downKeyPressed = false; break;
            }
        });
    }

    update() {
        const vehicle = this.targetVehicle || this.entity;
        if (!vehicle) return;

        let steering = 0;
        let throttle = 0;

        if (this.leftButtonPressed || this.leftKeyPressed) steering += 1;
        if (this.rightButtonPressed || this.rightKeyPressed) steering -= 1;
        if (this.upButtonPressed || this.upKeyPressed) throttle += 1;
        if (this.downButtonPressed || this.downKeyPressed) throttle -= 1;

        this.app.xr.input.inputSources.forEach((input) => {
            if (input.handedness === XRHAND_LEFT) {
                steering = -input.gamepad.axes[2];
                throttle -= input.gamepad.buttons[0].value;
            }
            if (input.handedness === XRHAND_RIGHT) {
                throttle += input.gamepad.buttons[0].value;
            }
        });

        vehicle.script.vehicle.fire('vehicle:controls', steering, throttle);
    }
}