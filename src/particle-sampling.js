/** Convert an already downsampled RGBA grid into normalized targets. */
export function sampleRGBA(data, width, height, { gamma, threshold, mode, jitter }, random = Math.random) {
  const result = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const coverage = data[i + 3] / 255;
      const luminance = (data[i] * 2126 + data[i + 1] * 7152 + data[i + 2] * 722) / 2550000;
      const value = mode === 'alpha' ? coverage : coverage * Math.pow(mode === 'dark' ? 1 - luminance : luminance, gamma);
      if (value <= threshold) continue;
      result.push({ x: (x + 0.5 + (random() - 0.5) * jitter) / width,
        y: (y + 0.5 + (random() - 0.5) * jitter) / height, alpha: value });
    }
  }
  return result;
}

export function gridSize(width, height, gap, maxParticles) {
  let cols = Math.min(maxParticles, Math.max(1, Math.floor(width / gap)));
  let rows = Math.min(maxParticles, Math.max(1, Math.floor(height / gap)));
  if (cols * rows > maxParticles) {
    const scale = Math.sqrt(maxParticles / (cols * rows));
    cols = Math.max(1, Math.floor(cols * scale));
    rows = Math.max(1, Math.floor(rows * scale));
  }
  // Extremely thin images may leave one dimension clamped to 1.
  if (cols * rows > maxParticles) {
    if (cols >= rows) cols = Math.max(1, Math.floor(maxParticles / rows));
    else rows = Math.max(1, Math.floor(maxParticles / cols));
  }
  return [cols, rows];
}

export function shuffle(items, random = Math.random) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
