import { Quaternion, Matrix4 } from "three";

const ROTATE_FORWARD = new Quaternion().setFromRotationMatrix(
  new Matrix4().makeRotationX(Math.PI / 2)
);
const ROTATE_BACKWARD = new Quaternion().setFromRotationMatrix(
  new Matrix4().makeRotationX(-Math.PI / 2)
);

export function encodeRotation(quaternion) {
  const { x, y, z, w } = quaternion.clone().multiply(ROTATE_BACKWARD);
  return [w, x, y, z];
}

export function decodeRotation(quatArray) {
  const [w, x, y, z] = quatArray;
  return new Quaternion(x, y, z, w).multiply(ROTATE_FORWARD);
}
