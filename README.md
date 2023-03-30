# apng-js-mini

`apng-js-mini` provides functions for parse and render animated PNG's 
([APNG](https://en.wikipedia.org/wiki/APNG)).
## Usage
`npm install apng-js-mini`
 
## API

### parseAPNG(buf: ArrayBuffer): (APNG|Error)

### isNotPNG(err: Error): boolean

Checks if Error is 'Not a PNG' error.

### isNotAPNG(err: Error): boolean

Checks if Error is 'Not an animated PNG' error.

## Classes

### APNG
Structure of APNG file.
````
class APNG {
    width: number     // with of canvas, pixels
    height: number    // height of canvas, pixels
    numPlays: number  // number of times to loop animation (0 = infinite looping)
    playTime: number  // total duration of one loop in milliseconds
    frames: Frame[]   // array of frames
    startFrame: number // start frame
    endFrame: number // end frame

    // Methods
    createImages(): Promise // create imageElement's for all frames
    getPlayer(context: CanvasRenderingContext2D, autoPlay: boolean = false): Promise.<Player>
        // Create Player (see below) on given context and start playing
        // if autoPlay is true.
    applyRange(startFrame, endFrame): void // apply frame execute range
    resetRange(): void // reset execute range
}
````

### Frame
Individual APNG frame.
````
class Frame {
    left: number      // left offset of frame, pixels
    top: number       // top offset of frame, pixels
    width: number     // with of frame, pixels
    height: number    // height of frame, pixels
    delay: number     // time to show frame in milliseconds
    disposeOp: number // type of dispose operation (see APNG spec.)
    blendOp: number   // type of blend operation (see APNG spec.)
    imageData: Blob   // image data in PNG (not animated) format
    
    imageElement: HTMLImageElement // image data rendered as HTML Image element.
                                   // This field is null right after 'parse',
                                   // use Frame.createImage() or APNG.createImages()
                                   // to fill this field.
                                   
    // Methods
    createImage(): Promise // create imageElement for this frame
}
````
### Player
Player renders APNG frames on given rendering context and plays APNG animation.
````
class Player {
    context: CanvasRenderingContext2D
    playbackRate: number = 1.0 // animation playback rate
           
    currFrameNumber: number // current frame number (read only)
    currFrame: Frame        // current frame (read only)
    paused: boolean         // playback is paused (read only)
    ended: boolean          // playback is ended (read only)

    // Methods
    play()      // start or resume playback
    pause()     // pause playback
    stop()      // stop playback and rewind to start
    
    renderNextFrame()       // move to next frame and render it on context
                            // Use this method to manual, frame by frame, rendering.
}
````

Player object is an [EventEmitter](https://nodejs.org/api/events.html). You can listen to following events:

  * **play** — playback started;
  * **frame** — frame played (frame number passed as event parameter);
  * **pause** — playback paused;
  * **stop** — playback stopped;
  * **end** — playback ended (for APNG with finite count of plays).
