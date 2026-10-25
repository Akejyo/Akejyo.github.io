/** Velocity coefficient multiplied by the vector away from the pointer.
 * Its magnitude approaches 1/distance without a hard cutoff. */
export function pointerFactor(distance, strength, scale = 1) {
  const normalizedDistance = distance / scale;
  return strength * 360 / ((1 + normalizedDistance) * (1 + normalizedDistance));
}

/** Exact first-order relaxation with a constant external velocity over dt. */
export function relaxOffset(offset, velocity, dt, returnTime) {
  const decay = Math.exp(-dt / returnTime);
  return offset * decay + velocity * (returnTime / 1000) * (1 - decay);
}

/** Follow the remaining distance: fast when far away, slow near the target. */
export function followTarget(value, target, dt, returnTime) {
  return value + (target - value) * -Math.expm1(-dt / returnTime);
}

/** Different per-particle timing, with the same exact transition end time. */
export function particleProgress(progress, returnTime, meanReturnTime) {
  return 1 - Math.pow(1 - progress, meanReturnTime / returnTime);
}
