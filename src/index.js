import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Viewer from "./viewer";
import TopBar from "./topbar";
import Sidebar from "./sidebar";

function computeViewerPosition(img) {
  const { naturalHeight, naturalWidth, height, width } = img;
  const rescale = Math.min(height / naturalHeight, width / naturalWidth);
  const [newHeight, newWidth] = [
    naturalHeight * rescale,
    naturalWidth * rescale,
  ];
  return {
    height: newHeight,
    width: newWidth,
    left: (width - newWidth) / 2,
    top: (height - newHeight) / 2,
  };
}

function App() {
  console.log("index re-render");

  const [images, setImages] = React.useState([]);
  const [intrinsics, setIntrinsics] = React.useState();
  const [model, setModel] = React.useState();
  const [currentImageIndex, setCurrentImageIndex] = React.useState();
  const [viewerPosition, setViewerPosition] = React.useState();
  const [poses, setPoses] = React.useState({});
  const [currentPose, setCurrentPose] = React.useState({});

  const imgRef = React.useRef();
  const imgUrl = React.useMemo(
    () =>
      images.length > 0 ? URL.createObjectURL(images[currentImageIndex]) : null,
    [images, currentImageIndex]
  );

  const handleKeyDown = React.useCallback(
    (event) => {
      if (images.length === 0 || event.repeat) return;
      if (event.code === "PageDown")
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
      if (event.code === "PageUp")
        setCurrentImageIndex(
          (currentImageIndex - 1 + images.length) % images.length // Javascript is a cruel joke
        );
    },
    [images, currentImageIndex]
  );
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      if (imgRef.current)
        setViewerPosition(computeViewerPosition(imgRef.current));
    });
  }, []);

  const setPose = React.useCallback(
    (pose) => {
      if (poses[images[currentImageIndex].name]) {
        // copy into the same reference so that the viewer doesn't re-render
        Object.assign(poses[images[currentImageIndex].name], pose);
      } else {
        poses[images[currentImageIndex].name] = pose;
      }
      // do mutate the currentPose reference so that the topbar re-renders
      setCurrentPose(pose);
    },
    [poses, images, currentImageIndex]
  );

  return (
    <div className="main-wrapper">
      <TopBar
        {...{
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
        }}
      />
      <div className="body-wrapper">
        <div className="Viewer-wrapper">
          {images.length > 0
            ? [
                <img
                  className="background-image"
                  alt=""
                  key="img"
                  ref={imgRef}
                  src={imgUrl}
                  onLoad={() => {
                    setViewerPosition(computeViewerPosition(imgRef.current));
                  }}
                />,
                <Viewer
                  key="viewer"
                  {...{
                    images,
                    fov: intrinsics
                      ? intrinsics[images[currentImageIndex].name].fov_y
                      : 40,
                    model,
                    position: viewerPosition,
                    initialPose: poses[images[currentImageIndex].name],
                    setPose,
                  }}
                />,
              ]
            : null}
        </div>
        <Sidebar
          {...{
            images,
            currentImageIndex,
            setCurrentImageIndex,
          }}
        />
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
