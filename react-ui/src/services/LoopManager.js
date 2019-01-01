// @flow
import { timeout } from 'utils/functions'

type LoopAPI = {
  running: boolean,
  start: () => void,
  stop: () => void
}
type ThreeStrap = {
  Loop: LoopAPI,
  canvas: HTMLCanvasElement
}

export default class LoopManager {

  Loop: LoopAPI
  isInSlowMode: boolean
  slowOnTime: number
  slowOffTime: number
  canvas: HTMLCanvasElement

  constructor(threestrap: ThreeStrap, slowOffTime: number = 10, slowOnTime: number = 300) {
    this.Loop = threestrap.Loop
    this.canvas = threestrap.canvas
    this.slowOffTime = slowOffTime
    this.slowOnTime = slowOnTime

    this.canvas.addEventListener('mousedown', () => {
      this.exitSlowMode()
    } )
    this.canvas.addEventListener('touchstart', () => {
      this.exitSlowMode()
    } )
    this.canvas.addEventListener('mouseup', () => {
      this.enterSlowMode()
    } )
    this.canvas.addEventListener('touchend', () => {
      this.enterSlowMode()
    } )

  }

  slowModeCycle = async () => {
    this.Loop.start()
    await timeout(this.slowOnTime)
    if (this.isInSlowMode) { this.Loop.stop() }
    await timeout(this.slowOffTime)
    if (this.isInSlowMode) { this.slowModeCycle() }
  }

  enterSlowMode = () => {
    if (this.isInSlowMode) { return }
    this.isInSlowMode = true
    this.slowModeCycle()
  }

  exitSlowMode = () => {
    this.isInSlowMode = false
    this.Loop.start()
  }

}
