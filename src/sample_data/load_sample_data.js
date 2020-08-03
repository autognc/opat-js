import image_000 from "./image_000.png";
import image_240 from "./image_240.png";
import image_480 from "./image_480.png";
import cygnus from "./cygnus.glb";
import intrinsics from "./intrinsics.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const IMAGE_NAMES = ["image_000.png", "image_240.png", "image_480.png"];

export default function loadSampleData(setImages, setIntrinsics, setModel) {
  const imagesPromise = Promise.all(
    [image_000, image_240, image_480].map((image, i) =>
      window
        .fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          blob.name = IMAGE_NAMES[i];
          return blob;
        })
    )
  );
  const loader = new GLTFLoader();
  const modelPromise = window
    .fetch(cygnus)
    .then((res) => res.arrayBuffer())
    .then(
      (ab) =>
        new Promise((resolve) =>
          loader.parse(ab, "", (gltf) => resolve(gltf.scenes[0].children[0]))
        )
    );

  Promise.all([imagesPromise, modelPromise]).then(([images, model]) => {
    setImages(images);
    setModel(model);
    setIntrinsics(intrinsics);
  });
}
