import Player from "./player";

/**
 * @property {number} currFrameNumber
 * @property {Frame} currFrame
 * @property {boolean} paused
 * @property {boolean} ended
 */
export class APNG {
  /** @type {number} */
  width = 0;
  /** @type {number} */
  height = 0;
  /** @type {number} */
  numPlays = 0;
  /** @type {number} */
  playTime = 0;
  /** @type {Frame[]} */
  frames = [];

  /**
   *
   * @return {Promise.<*>}
   */
  createImages(canvas) {
    return Promise.all(this.frames.map((f) => f.createImage(canvas)));
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param {boolean} autoPlay
   * @return {Promise.<Player>}
   */
  getPlayer(canvas, autoPlay = false) {
    return this.createImages(canvas).then(() => {
      const ctx = canvas.getContext("2d");
      return new Player(this, ctx, autoPlay);
    });
  }
}

export class Frame {
  /** @type {number} */
  left = 0;
  /** @type {number} */
  top = 0;
  /** @type {number} */
  width = 0;
  /** @type {number} */
  height = 0;
  /** @type {number} */
  delay = 0;
  /** @type {number} */
  disposeOp = 0;
  /** @type {number} */
  blendOp = 0;
  /** @type {Blob} */
  imageData = null;
  imageElement1 = null;

  createImage(canvas) {
    if (this.imageElement1) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(this.imageData);
      this.imageElement1 = canvas.createImage();
      this.imageElement1.onload = () => {
        // URL.revokeObjectURL(url);
        resolve();
      };
      this.imageElement1.onerror = () => {
        URL.revokeObjectURL(url);
        this.imageElement = null;
        reject(new Error("Image creation error"));
      };
      this.imageElement1.src = url;
    });
  }
}
