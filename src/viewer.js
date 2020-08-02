import React from "react";
import { extend } from "react-three-fiber";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { Quaternion, Vector3 } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import Controls from "./controls";
import CONFIG from "./config";
import OpacityShader from "./OpacityShader";
extend({ ShaderPass, RenderPass, EffectComposer });

function Renderer({ model, fov, setPose, initialPose }) {
  console.log("renderer re-render");
  const { camera, gl, scene } = useThree();

  const controls = React.useMemo(() => new Controls(model, setPose), [
    model,
    setPose,
  ]);
  React.useEffect(() => {
    controls.register();

    return () => controls.deregister();
  }, [controls]);

  React.useEffect(() => {
    camera.fov = fov;
    camera.up = new Vector3(0, -1, 0);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 100);
    camera.updateProjectionMatrix();

    let pose;
    if (initialPose) {
      pose = initialPose;
    } else if (model.position.z === 0) {
      pose = {
        position: CONFIG.default_pose.position.slice(),
        rotation: CONFIG.default_pose.rotation.slice(),
      };
    } else {
      const { x, y, z, w } = model.quaternion;
      pose = {
        position: model.position.toArray(),
        rotation: [w, x, y, z],
      };
    }
    const [w, x, y, z] = pose.rotation;
    model.position.set(...pose.position);
    model.setRotationFromQuaternion(new Quaternion(x, y, z, w));
    setPose(pose);
  });

  const composer = React.useRef();
  useFrame((state, delta) => {
    controls.update(delta);
    composer.current.render();
  }, 1);

  return [
    <primitive key="object" object={model} />,
    <effectComposer key="composer" ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" args={[OpacityShader(CONFIG.opacity)]} />
    </effectComposer>,
  ];
}

function Viewer({ model, fov, position, setPose, initialPose }) {
  console.log("viewer re-render");

  return (
    <Canvas style={{ position: "absolute", ...position }}>
      <pointLight position={[0, 0, 0]} intensity={1} />
      {model ? <Renderer {...{ model, fov, setPose, initialPose }} /> : null}
    </Canvas>
  );
}

export default React.memo(Viewer);
