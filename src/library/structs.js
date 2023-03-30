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
  // 开始帧
  startFrame = -1;
  // 结束帧
  endFrame = -1;


  /**
   * 
   * @param {number} startFrame 
   * @param {number} endFrame 
   */
  applyRange(startFrame, endFrame) {
    this.startFrame = startFrame;
    this.endFrame = endFrame;
  }

  // 重置动画运行范围
  resetRange() {
    this.startFrame = 0
    this.endFrame = this.frames.length - 1;
  }



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
    return this.createImages(canvas).then(() => new Player(this, canvas, autoPlay)
    );
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
  imageEle = null;

  createImage(canvas) {
    if (this.imageElement) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.imageElement = canvas.createImage();
      this.imageElement.onload = () => {
        resolve();
      };
      this.imageElement.onerror = () => {
        this.imageElement = null;
        reject(new Error("Image creation error"));
      };
      this.imageElement.src = 'data:image/png;base64,' + this.imageData;
    });
  }
}
