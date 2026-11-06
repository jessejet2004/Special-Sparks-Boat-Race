/** Keep coordinates in CSS pixels while allocating a high-DPI backing store. */
export function prepareCanvas(
  canvas: HTMLCanvasElement,
  width = canvas.clientWidth,
  height = canvas.clientHeight,
  pixelRatio = window.devicePixelRatio || 1,
) {
  const dpr = Math.min(3, Math.max(1, pixelRatio));
  const w = Math.max(1, width),
    h = Math.max(1, height);
  const bw = Math.round(w * dpr),
    bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(bw / w, 0, 0, bh / h, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  canvas.dataset.pixelRatio = String(dpr);
  return { ctx, width: w, height: h, dpr };
}
