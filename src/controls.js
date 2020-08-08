import { Vector3 } from "three";
import { encodeRotation } from "./utils";

export default class Controls {
  constructor(model, setPose, config) {
    this.config = config;
    this.actions = Object.fromEntries(
      Object.entries(config.keybindings).map(([action, keycode]) => [
        keycode,
        this[action] ? this[action].bind(this) : action,
      ])
    );
    this.model = model;
    this.keyDownListener = this.handleKeyDown.bind(this);
    this.keyUpListener = this.handleKeyUp.bind(this);
    this.executingActions = new Set();
    this.translate_speed = config.translate_speed;
    this.rotate_speed = (config.rotate_speed * 2 * Math.PI) / 180;
    this.setPose = setPose;
  }

  register() {
    document.addEventListener("keydown", this.keyDownListener);
    document.addEventListener("keyup", this.keyUpListener);
  }

  deregister() {
    document.removeEventListener("keydown", this.keyDownListener);
    document.removeEventListener("keyup", this.keyUpListener);
  }

  handleKeyDown(event) {
    // if (this.actions[event.code]) event.preventDefault();
    if (event.repeat) return;
    switch (this.actions[event.code]) {
      case undefined:
        break;
      case "decreaseSpeed":
        this._decreaseSpeed();
        break;
      case "savePose":
        event.preventDefault();
        break;
      default:
        this.executingActions.add(this.actions[event.code]);
    }
  }

  handleKeyUp(event) {
    // if (this.actions[event.code]) event.preventDefault();
    switch (this.actions[event.code]) {
      case undefined:
        break;
      case "decreaseSpeed":
        this._resetSpeed();
        break;
      case "savePose":
        event.preventDefault();
        this._recordPose(true);
        break;
      default:
        this.executingActions.delete(this.actions[event.code]);
        this._recordPose(false);
    }
  }

  update(delta) {
    for (const action of this.executingActions) {
      action(delta);
    }
  }

  _recordPose(save) {
    this.setPose(
      {
        position: this.model.position.toArray(),
        rotation: encodeRotation(this.model.quaternion),
      },
      save
    );
  }

  _decreaseSpeed() {
    this.translate_speed = this.config.translate_speed_low;
    this.rotate_speed = (this.config.rotate_speed_low * 2 * Math.PI) / 180;
  }
  _resetSpeed() {
    this.translate_speed = this.config.translate_speed;
    this.rotate_speed = (this.config.rotate_speed * 2 * Math.PI) / 180;
  }

  translateUp(delta) {
    this.model.position.y -= this.translate_speed * delta;
  }
  translateDown(delta) {
    this.model.position.y += this.translate_speed * delta;
  }
  translateLeft(delta) {
    this.model.position.x -= this.translate_speed * delta;
  }
  translateRight(delta) {
    this.model.position.x += this.translate_speed * delta;
  }
  translateForward(delta) {
    this.model.position.z += this.translate_speed * delta;
  }
  translateBackward(delta) {
    this.model.position.z -= this.translate_speed * delta;
  }
  rotatePlusZ(delta) {
    this.model.rotateOnAxis(new Vector3(0, 0, 1), this.rotate_speed * delta);
  }
  rotateMinusZ(delta) {
    this.model.rotateOnAxis(new Vector3(0, 0, 1), -this.rotate_speed * delta);
  }
  rotatePlusY(delta) {
    this.model.rotateOnAxis(new Vector3(0, 1, 0), this.rotate_speed * delta);
  }
  rotateMinusY(delta) {
    this.model.rotateOnAxis(new Vector3(0, 1, 0), -this.rotate_speed * delta);
  }
  rotatePlusX(delta) {
    this.model.rotateOnAxis(new Vector3(1, 0, 0), this.rotate_speed * delta);
  }
  rotateMinusX(delta) {
    this.model.rotateOnAxis(new Vector3(1, 0, 0), -this.rotate_speed * delta);
  }
}
