const CONFIG = {
  keybindings: {
    translateUp: "KeyW",
    translateDown: "KeyS",
    translateLeft: "KeyA",
    translateRight: "KeyD",
    translateForward: "KeyZ",
    translateBackward: "KeyX",
    rotateMinusZ: "ArrowDown",
    rotatePlusZ: "ArrowUp",
    rotateMinusY: "ArrowLeft",
    rotatePlusY: "ArrowRight",
    rotateMinusX: "Slash",
    rotatePlusX: "Period",
    decreaseSpeed: "ShiftLeft",
    savePose: "Enter",
  },
  opacity: 0.7,
  // meters/second
  translate_speed: 5,
  translate_speed_low: 0.5,
  // degrees/second
  rotate_speed: 20,
  rotate_speed_low: 2,
  default_pose: {
    position: [0, 0, 50],
    rotation: [1, 0, 0, 0],
  },
};

export default CONFIG;
