import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Tunable constants ──────────────────────────────────────────────────────────
const WALK_SPEED   = 5.5;   // m/s horizontal
const SPRINT_SPEED = 11.0;  // m/s horizontal (Shift held)
const JUMP_VEL     = 7.2;   // m/s initial upward velocity
const GRAVITY      = -24.0; // m/s² downward acceleration (game-feel exaggerated)
const EYE_HEIGHT   = 1.72;  // camera height above feet
const PROBE_DIST   = 2.8;   // downward ray length for ground detection
const WALL_DIST    = 0.38;  // horizontal collision radius

// ── Pre-allocated heap objects (avoids per-frame GC pressure) ─────────────────
const _euler   = new THREE.Euler(0, 0, 0, "YXZ");
const _fwd     = new THREE.Vector3();
const _rgt     = new THREE.Vector3();
const _move    = new THREE.Vector3();
const _origin  = new THREE.Vector3();
const _torso   = new THREE.Vector3();
const _downDir = new THREE.Vector3(0, -1, 0);
const _xPos    = new THREE.Vector3(1,  0, 0);
const _xNeg    = new THREE.Vector3(-1, 0, 0);
const _zPos    = new THREE.Vector3(0,  0, 1);
const _zNeg    = new THREE.Vector3(0,  0, -1);

// ── Module-level state — updated every frame without causing re-renders ────────
const fpsKeys = new Set<string>();
let velY     = 0;
let grounded = false;
let bobPhase = 0;

// ── Persistent raycasters ─────────────────────────────────────────────────────
const groundRay = new THREE.Raycaster();
const wallRay   = new THREE.Raycaster();

// ── Collidable-mesh cache ─────────────────────────────────────────────────────
// Rebuilding via scene.traverse() costs ~0.5 ms/frame on large scenes.
// We cache and rebuild only every 90 frames (~1.5 s at 60 fps), giving 90× less work.
let _collidableCache: THREE.Mesh[] = [];
let _cacheAge = 0;

/**
 * Pure-JS first-person controller — no physics engine, no WASM, no crashes.
 *
 * Physics simulation:
 *   • Gravity via velY accumulation each frame
 *   • Ground detection: downward raycast against scene meshes
 *   • Jump: Space key when grounded
 *   • Wall collision: separate X/Z raycasts → smooth wall sliding
 *   • Head bob: sinusoidal Y offset while walking/sprinting
 *   • Safety floor at y < -8 to catch edge cases (void, missing ground)
 */
export function PhysicsPlayerController() {
  const { camera, scene } = useThree();

  // ── Key listener setup / teardown ─────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => fpsKeys.add(e.code);
    const onUp   = (e: KeyboardEvent) => fpsKeys.delete(e.code);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
      // Reset all state when FPS mode is exited
      fpsKeys.clear();
      velY     = 0;
      grounded = false;
      bobPhase = 0;
      _collidableCache = [];
      _cacheAge = 0;
    };
  }, []);

  useFrame((_, rawDt) => {
    // Cap dt so unfocused tabs don't cause multi-metre position jumps
    const dt = Math.min(rawDt, 1 / 30);

    // ── Movement direction — horizontal only, based on camera yaw ──────────
    _euler.setFromQuaternion(camera.quaternion);
    const yaw = _euler.y;
    _fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    _rgt.set( Math.cos(yaw), 0, -Math.sin(yaw));

    const sprint = fpsKeys.has("ShiftLeft") || fpsKeys.has("ShiftRight");
    const spd    = (sprint ? SPRINT_SPEED : WALK_SPEED) * dt;

    _move.set(0, 0, 0);
    if (fpsKeys.has("KeyW")) _move.addScaledVector(_fwd,  1);
    if (fpsKeys.has("KeyS")) _move.addScaledVector(_fwd, -1);
    if (fpsKeys.has("KeyA")) _move.addScaledVector(_rgt, -1);
    if (fpsKeys.has("KeyD")) _move.addScaledVector(_rgt,  1);
    if (_move.lengthSq() > 0) _move.normalize().multiplyScalar(spd);
    const isMoving = _move.lengthSq() > 1e-8;

    // ── Build collidable mesh list (cached — rebuild every 90 frames) ──────
    _cacheAge++;
    if (_cacheAge >= 90 || _collidableCache.length === 0) {
      _cacheAge = 0;
      _collidableCache = [];
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.visible && !obj.userData.noCollide) {
          _collidableCache.push(obj);
        }
      });
    }
    const collidables = _collidableCache;

    // ── Ground probe (downward ray from shin level) ─────────────────────────
    _origin.set(
      camera.position.x,
      camera.position.y - EYE_HEIGHT + 0.18,   // shin height
      camera.position.z
    );
    groundRay.set(_origin, _downDir);
    groundRay.far = PROBE_DIST;
    const groundHits = groundRay.intersectObjects(collidables, false);

    if (groundHits.length > 0) {
      const surfaceY = groundHits[0].point.y + EYE_HEIGHT;
      const diff     = camera.position.y - surfaceY;
      if (diff <= 0.2 && velY <= 0.05) {
        // On or just touching ground — snap and stop vertical velocity
        grounded = true;
        velY     = 0;
        camera.position.y = surfaceY;
      } else {
        grounded = false;
      }
    } else {
      grounded = false;
    }

    // ── Jump ─────────────────────────────────────────────────────────────────
    if (fpsKeys.has("Space") && grounded) {
      velY     = JUMP_VEL;
      grounded = false;
    }

    // ── Gravity + vertical integration ───────────────────────────────────────
    velY += GRAVITY * dt;
    camera.position.y += velY * dt;

    // ── Horizontal movement with wall sliding ─────────────────────────────────
    // Check X and Z independently so the player slides along walls
    if (isMoving) {
      _torso.set(
        camera.position.x,
        camera.position.y - EYE_HEIGHT * 0.45,   // torso / chest height
        camera.position.z
      );

      // X axis
      if (Math.abs(_move.x) > 1e-6) {
        wallRay.set(_torso, _move.x > 0 ? _xPos : _xNeg);
        wallRay.far = WALL_DIST;
        if (wallRay.intersectObjects(collidables, false).length === 0) {
          camera.position.x += _move.x;
        }
      }

      // Z axis
      if (Math.abs(_move.z) > 1e-6) {
        wallRay.set(_torso, _move.z > 0 ? _zPos : _zNeg);
        wallRay.far = WALL_DIST;
        if (wallRay.intersectObjects(collidables, false).length === 0) {
          camera.position.z += _move.z;
        }
      }
    }

    // ── Emergency void floor ──────────────────────────────────────────────────
    // If the player somehow falls way below the scene, teleport back up
    if (camera.position.y < -8 + EYE_HEIGHT) {
      camera.position.y = EYE_HEIGHT + 0.5;
      velY     = 0;
      grounded = true;
    }

    // ── Head bob for walking immersion ────────────────────────────────────────
    if (isMoving && grounded) {
      bobPhase += dt * (sprint ? 14 : 9);
      camera.position.y += Math.sin(bobPhase) * (sprint ? 0.065 : 0.04);
    } else {
      bobPhase = 0;
    }
  });

  return null;
}
