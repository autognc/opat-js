const CONFIG = {
  keybindings: {
    KeyW: "translateUp",
    KeyS: "translateDown",
    KeyA: "translateLeft",
    KeyD: "translateRight",
    KeyZ: "translateForward",
    KeyX: "translateBackward",
    ArrowDown: "rotateMinusZ",
    ArrowUp: "rotatePlusZ",
    ArrowLeft: "rotateMinusY",
    ArrowRight: "rotatePlusY",
    Slash: "rotateMinusX",
    Period: "rotatePlusX",
    ShiftLeft: "decreaseSpeed",
    Enter: "savePose",
  },
  opacity: 0.7,
  // meters/second
  translate_speed: 5,
  translate_speed_low: 1,
  // degrees/second
  rotate_speed: 20,
  rotate_speed_low: 5,
  default_pose: {
    position: [0, 0, 50],
    rotation: [1, 0, 0, 0],
  },
};

export default CONFIG;
