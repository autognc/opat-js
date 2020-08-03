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

function loadModel(loader, file, setModel, setError) {
  file.arrayBuffer().then((ab) => {
    try {
      loader.parse(ab, "", (gltf) => {
        setModel(gltf.scenes[0].children[0]);
        setError(null);
      });
    } catch {
      setError("Error loading model. Please try again.");
    }
  });
}

function loadIntrinsics(
  file,
  setIntrinsics,
  setError,
  setIntrinsicsName,
  images
) {
  file.text().then((resultText) => {
    let intrinsics;
    try {
      intrinsics = JSON.parse(resultText);
    } catch {
      setError("Error parsing intrinsics file. Please try again.");
      return;
    }
    const names = new Set(Array.from(images).map((i) => i.name));
    if (!Object.keys(intrinsics).every((i) => names.has(i))) {
      setError("Intrinsics keys do not match image filenames.");
      return;
    }
    if (!Object.values(intrinsics).every((i) => typeof i.fov_y === "number")) {
      setError("Intrinsics file has incorrect format.");
      return;
    }
    setIntrinsics(intrinsics);
    setIntrinsicsName(file.name);
    setError(null);
  });
}

function loadPoses(file, setPoses, setError, images) {
  file.text().then((resultText) => {
    let poses;
    try {
      poses = JSON.parse(resultText);
    } catch {
      setError("Error parsing poses file. Please try again.");
    }
    const names = new Set(Array.from(images).map((i) => i.name));
    if (!Object.keys(poses).every((p) => names.has(p))) {
      setError("Poses keys do not match image filenames.");
      return;
    }
    if (
      !Object.values(poses).every(
        (p) =>
          Array.isArray(p.position) &&
          Array.isArray(p.rotation) &&
          p.position.length === 3 &&
          p.rotation.length === 4 &&
          p.position.concat(p.rotation).every((e) => typeof e === "number")
      )
    ) {
      setError("Poses file has incorrect format.");
      return;
    }
    setPoses(poses);
    setError(null);
  });
}

function OpenFileButton(props) {
  const ref = React.useRef();
  const { children, label, disabled, ...others } = props;
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
      <Button
        size="sm"
        variant="light"
        disabled={disabled === undefined ? false : disabled}
        onClick={() => ref.current.click()}
      >
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
  model,
  setModel,
  setIntrinsics,
  currentPose,
  setPoses,
  poses,
  isPoseSaved,
}) {
  const [intrinsicsName, setIntrinsicsName] = React.useState("");
  const [modelName, setModelName] = React.useState("");
  const [error, setError] = React.useState(null);
  const loader = React.useMemo(() => new GLTFLoader(), []);

  return (
    <div className="StatusBar">
      {currentPose && currentPose.position && currentPose.rotation && !error ? (
        <div className={`pose ${isPoseSaved ? "saved" : ""}`}>
          <div>{`position: (${currentPose.position.map((n) =>
            n.toFixed(2)
          )})`}</div>
          <div>{`rotation: (${currentPose.rotation.map((n) =>
            n.toFixed(2)
          )})`}</div>
        </div>
      ) : null}
      {error ? <div className="error">{error}</div> : null}
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
              loadModel(loader, event.target.files[0], setModel, setError);
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
          disabled={!(model && images)}
          onChange={(event) => {
            if (event.target.files.length > 0) {
              loadIntrinsics(
                event.target.files[0],
                setIntrinsics,
                setError,
                setIntrinsicsName,
                images
              );
            }
          }}
        >
          Load intrinsics
        </OpenFileButton>
      </div>
      <div>
        <OpenFileButton
          accept=".json"
          disabled={!(model && images)}
          onChange={(event) => {
            if (event.target.files.length > 0) {
              loadPoses(event.target.files[0], setPoses, setError, images);
            }
          }}
        >
          Load poses
        </OpenFileButton>
      </div>
      <div>
        <Button
          size="sm"
          variant="light"
          disabled={Object.keys(poses).length === 0}
          onClick={() => saveAs(poses)}
        >
          Download poses
        </Button>
      </div>
    </div>
  );
}
