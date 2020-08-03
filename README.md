# Object Pose Annotation Tool

https://autognc.github.io/opat-js

A lightweight interactive 6D pose annotation tool. Loads images and overlays a 3D model on top of them, allowing
the user to line up the model and an object in the image using keyboard shortcuts.

## Usage

### Loading a model
Currently, the only supported model format is a single `.glb` file which is loaded using the three.js [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader).
The model is retrieved from `gltf.scenes[0].children[0]`; any additional models or scene data is ignored.

### Loading intrinsics
Once images and a model have been loaded, camera intrinsics can be loaded from a JSON file.
There must be an entry for every image with the format:

```
{
    "image_file_name.png": {"fov_y": vertical_fov_in_degrees}
}
```

Currently, the horizontal FOV is calculated from the aspect ratio of the image
and there is no support for differing vertical/horizontal pixel lengths. The principal
point is assumed to be the center of the image; there is not yet support for a crop or offset.

### Keybindings
See [src/config.js](src/config.js) for keybindings. When the position and rotation readout
at the top left is green, that means the current pose is saved.

## Development
This project was created with [Create React App](https://github.com/facebook/create-react-app).

Enter the project directory and run `npm install`. To run the app locally, run `npm start`. To [deploy to GitHub pages](https://create-react-app.dev/docs/deployment/#github-pages),
run `npm run deploy`.