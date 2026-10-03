# Input and Controller Normalization

Animation does not consume raw keyboard, wheel, mouse or gamepad events directly.

## Common intent layer

Normalize device input to a small device-neutral intent.

Conceptual shape:

```ts
type MotionIntent = {
  move: { x: number; y: number }
  look?: { x: number; y: number }
  desiredSpeed01: number
  sprintIntent: boolean
  jumpPressed: boolean
  actionPressed?: boolean
  travelModeRequest?: string
  source: 'keyboard' | 'gamepad' | 'pointer' | 'touch' | 'ai'
}
```

The movement owner turns intent into actual movement facts.
Animation consumes those facts.

## Keyboard

Digital input is binary, but motion should not feel binary.

Use:
- target velocity;
- acceleration/deceleration shaping;
- turn smoothing as appropriate;
- semantic sprint intent.

Do not jump instantly from idle to sprint pose because Shift+W became true.

## Gamepad

Use:
- circular/radial deadzone;
- normalized magnitude;
- response curve only when needed;
- separate look/move sticks;
- trigger/button actions as semantic intent.

Analog magnitude may drive target speed continuously.

Do not bake device-specific speed thresholds into the animation graph.

## Mouse / pointer lock

Mouse deltas normally drive camera/look intent.
Animation may consume the resulting facing/turn facts, not raw pixel deltas.

## Touch / trackpad pointer

Normalize gestures/pointer motion to the same look/move intent layer.
Avoid a second touch-only animation state machine.

## Wheel / scroll

Wheel input is particularly easy to make unstable.

Rules:
- normalize delta units;
- accumulate steps/delta intentionally;
- clamp;
- use deadband/hysteresis if mapped to speed;
- cap per-frame influence;
- ignore burst outliers;
- distinguish camera zoom from travel-speed intent.

Never map raw wheel delta directly to gait/playback speed.

## Sprint

Sprint is an intent/capability signal, not a clip command.

Movement owner decides actual achievable speed.
Animation state owner decides whether sprint presentation is valid for the actual motion facts.

## Jump

Input event:
jumpPressed.

Movement/physics owner decides:
- whether jump is allowed;
- trajectory;
- grounded transition.

Animation consumes jump lifecycle facts.

## Camera-relative movement

Resolve device vector through camera/world control rules before animation state selection.
Animation should receive local motion direction relative to actor/facing as required by the project.

## Testing

For any controller implementation test:
- short press;
- held press;
- rapid direction reversal;
- diagonal;
- sprint press/release;
- jump while idle/moving;
- gamepad near deadzone;
- wheel burst;
- focus loss/reacquire;
- simultaneous look + move.
