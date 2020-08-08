import React from "react";
import { extend } from "react-three-fiber";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { encodeRotation, decodeRotation } from "./utils";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import Controls from "./controls";
import OpacityShader from "./OpacityShader";
extend({ ShaderPass, RenderPass, EffectComposer });

function Renderer({ model, fov, setPose, initialPose, config }) {
  console.log("renderer re-render");
  const { camera, gl, scene } = useThree();

  const controls = React.useMemo(() => new Controls(model, setPose, config), [
    model,
    setPose,
    config,
  ]);
  // Need useLayoutEffect because we want the controls to deregister ASAP (before render) whenever
  // the image changes. With regular useEffect, which happens after render, there is a brief window of time
  // between when the model's pose gets updated for the new image and when the old controls get de-registered.
  // Since the old controls have the old setPose, they can set the new image's pose on the old image during this window.
  React.useLayoutEffect(() => {
    controls.register();
    return () => controls.deregister();
  }, [controls]);

  camera.fov = fov;
  camera.up = new Vector3(0, -1, 0);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, 100);
  camera.far = 100000;
  camera.updateProjectionMatrix();

  let pose;
  if (initialPose) {
    pose = initialPose;
  } else if (model.position.z === 0) {
    pose = {
      position: config.default_pose.position.slice(),
      rotation: config.default_pose.rotation.slice(),
    };
  } else {
    pose = {
      position: model.position.toArray(),
      rotation: encodeRotation(model.quaternion),
    };
  }
  model.position.set(...pose.position);
  model.setRotationFromQuaternion(decodeRotation(pose.rotation));
  setPose(pose, false);

  const composer = React.useRef();
  useFrame((state, delta) => {
    controls.update(delta);
    composer.current.render();
  }, 1);

  return [
    <primitive key="object" object={model} />,
    <effectComposer key="composer" ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" args={[OpacityShader(config.opacity)]} />
    </effectComposer>,
  ];
}

function Viewer({ model, fov, position, setPose, initialPose, config }) {
  console.log("viewer re-render");

  return (
    <Canvas style={{ position: "absolute", ...position }}>
      <pointLight position={[0, 0, 0]} intensity={1} />
      {model ? (
        <Renderer {...{ model, fov, setPose, initialPose, config }} />
      ) : null}
    </Canvas>
  );
}

export default React.memo(Viewer);
