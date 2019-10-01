import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
// Scenes
import { MainScene } from "./scenes/MainScene";

class SampleGame {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: MainScene;
  constructor(canvasSelector: string) {
    // Bindings
    this.render = this.render.bind(this);
    // Start
    this.canvas = document.querySelector(canvasSelector);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new MainScene(this.engine, this.canvas);
    // Game loop
    this.engine.runRenderLoop(this.render);
  }
  private render() {
    this.scene.render();
  }
}

const game = new SampleGame(".renderCanvas");
