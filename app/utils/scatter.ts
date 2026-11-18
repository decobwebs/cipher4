/**
 * Choreography 09, "a scattered stack snaps together": a fixed, varied
 * starting place for item i (no randomness, so server and browser agree).
 * Returns CSS variables for motion.css (data-m="snap", .m-chip).
 */
export function scatter(i: number) {
  const x = (((i * 37) % 11) - 5) * 14
  const y = (((i * 53) % 9) - 4) * 12
  const r = (((i * 29) % 13) - 6) * 2
  return { '--x': `${x}px`, '--y': `${y}px`, '--r': `${r}deg`, '--i': i }
}
