import React from "react";
import { Button } from "react-bootstrap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function saveAs(obj) {
  if (Object.keys(obj).length === 0) {
    return;
  }
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(obj)], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "poses.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadModel(loader, file, setModel) {
  file.arrayBuffer().then((ab) => {
    loader.parse(ab, "", (gltf) => {
      setModel(gltf.scenes[0].children[0]);
    });
  });
}

function loadIntrinsics(file, setIntrinsics) {
  file.text().then((resultText) => setIntrinsics(JSON.parse(resultText)));
}

function loadPoses(file, setPoses) {
  file.text().then((resultText) => setPoses(JSON.parse(resultText)));
}

function OpenFileButton(props) {
  const ref = React.useRef();
  const { children, label, ...others } = props;
  return [
    <input
      key="input"
      type="file"
      ref={ref}
      style={{ display: "none" }}
      {...others}
    />,
    <div key="button" className="OpenFileButton">
      <div className="OpenFileButton-label">{label}</div>
      <Button size="sm" variant="light" onClick={() => ref.current.click()}>
        {children}
      </Button>
    </div>,
  ];
}

export default function TopBar({
  currentImageIndex,
  setCurrentImageIndex,
  images,
  setImages,
  setModel,
  setIntrinsics,
  currentPose,
  setPoses,
  poses,
}) {
  const [intrinsicsName, setIntrinsicsName] = React.useState("");
  const [modelName, setModelName] = React.useState("");
  const loader = React.useMemo(() => new GLTFLoader(), []);
  return (
    <div className="StatusBar">
      {currentPose && currentPose.position && currentPose.rotation
        ? [
            <div key="pos">{`position: (${currentPose.position.map((n) =>
              n.toFixed(2)
            )})`}</div>,
            <div key="rot">{`rotation: (${currentPose.rotation.map((n) =>
              n.toFixed(2)
            )})`}</div>,
          ]
        : null}
      <div>{images.length > 0 ? images[currentImageIndex].name : null}</div>
      <div>
        <OpenFileButton
          label={images.length ? `${images.length} images ` : null}
          multiple
          accept="image/*"
          onChange={(event) => {
            if (event.target.files.length > 0) {
              setCurrentImageIndex(0);
              setImages(event.target.files);
            }
          }}
        >
          Load images
        </OpenFileButton>
      </div>
      <div>
        <OpenFileButton
          label={modelName}
          accept=".glb"
          onChange={(event) => {
            if (event.target.files.length > 0) {
              setModelName(event.target.files[0].name);
              loadModel(loader, event.target.files[0], setModel);
            }
          }}
        >
          Load model
        </OpenFileButton>
      </div>
      <div>
        <OpenFileButton
          label={intrinsicsName}
          accept=".json"
          onChange={(event) => {
            if (event.target.files.length > 0) {
              setIntrinsicsName(event.target.files[0].name);
              loadIntrinsics(event.target.files[0], setIntrinsics);
            }
          }}
        >
          Load intrinsics
        </OpenFileButton>
      </div>
      <div>
        <OpenFileButton
          accept=".json"
          onChange={(event) => {
            if (event.target.files.length > 0) {
              loadPoses(event.target.files[0], setPoses);
            }
          }}
        >
          Load poses
        </OpenFileButton>
      </div>
      <div>
        <Button size="sm" variant="light" onClick={() => saveAs(poses)}>
          Save poses
        </Button>
      </div>
    </div>
  );
}
