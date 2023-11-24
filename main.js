import WindowManager from "./WindowManager.js";

const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let cubes = [];
let sceneOffsetTarget = { x: 0, y: 0 };
let sceneOffset = { x: 0, y: 0 };

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

let internalTime = getTime();
let windowManager;
let initialized = false;

// get time in seconds since beginning of the day (so that all windows use the same time)
function getTime() {
  return (new Date().getTime() - today) / 1000.0;
}

if (new URLSearchParams(window.location.search).get("clear")) {
  localStorage.clear();
} else {
  // this code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState != "hidden" && !initialized) {
      init();
    }
  });

  window.onload = () => {
    if (document.visibilityState != "hidden") {
      init();
    }
  };

  function init() {
    initialized = true;

    // add a short timeout because window.offsetX reports wrong values before a short period
    setTimeout(() => {
      setupScene();
      setupWindowManager();
      resize();
      updateWindowShape(false);
      render();
      window.addEventListener("resize", resize);
    }, 500);
  }

  function setupScene() {
    camera = new t.OrthographicCamera(
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      -10000,
      10000
    );

    camera.position.z = 2.5;
    near = camera.position.z - 0.5;
    far = camera.position.z + 0.5;

    scene = new t.Scene();
    scene.background = new t.Color(0.0);
    scene.add(camera);

    renderer = new t.WebGLRenderer({ antialias: true, depthBuffer: true });
    renderer.setPixelRatio(pixR);

    world = new t.Object3D();
    scene.add(world);

    renderer.domElement.setAttribute("id", "scene");
    document.body.appendChild(renderer.domElement);
  }

  function setupWindowManager() {
    windowManager = new WindowManager();
    windowManager.setWinShapeChangeCallback(updateWindowShape);
    windowManager.setWinChangeCallback(windowsUpdated);

    // here you can add your custom metadata to each windows instance
    let metaData = { foo: "bar" };

    // this will init the windowmanager and add this window to the centralised pool of windows
    windowManager.init(metaData);

    // call update windows initially (it will later be called by the win change callback)
    windowsUpdated();
  }

  function windowsUpdated() {
    let wins = windowManager.getWindows();
    console.log("Number of windows:", wins.length);
    console.log("Windows:", wins);
    // updateNumberOfCubes();
    // Call updateNumberOfHearts initially
    updateNumberOfHearts();
  }

  function updateNumberOfCubes() {
    let wins = windowManager.getWindows();

    // remove all cubes
    cubes.forEach((c) => {
      world.remove(c);
    });

    cubes = [];

    // add new cubes based on the current window setup
    for (let i = 0; i < wins.length; i++) {
      let win = wins[i];

      let c = new t.Color();
      c.setHSL(i * 0.1, 1.0, 0.5);

      let s = 100 + i * 50;
      let cube = new t.Mesh(
        new t.BoxGeometry(s, s, s),
        new t.MeshBasicMaterial({ color: c, wireframe: true })
      );
      cube.position.x = win.shape.x + win.shape.w * 0.5;
      cube.position.y = win.shape.y + win.shape.h * 0.5;

      world.add(cube);
      cubes.push(cube);
    }
  }

  // Replace the cube creation part with a heart shape
  function updateNumberOfHearts_v0() {
    let wins = windowManager.getWindows();

    // remove all hearts
    cubes.forEach((h) => {
      world.remove(h);
    });

    cubes = [];

    // add new hearts based on the current window setup
    for (let i = 0; i < wins.length; i++) {
      let win = wins[i];

      let heartShape = new t.Shape();
      heartShape.moveTo(25, 25);
      heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
      heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
      heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
      heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
      heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
      heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

      let extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 2,
        bevelThickness: 2,
      };

      let geometry = new t.ExtrudeBufferGeometry(heartShape, extrudeSettings);
      let material = new t.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      let heart = new t.Mesh(geometry, material);

      heart.position.x = win.shape.x + win.shape.w * 0.5;
      heart.position.y = win.shape.y + win.shape.h * 0.5;

      world.add(heart);
      cubes.push(heart);
    }
  }

  // Replace the cube creation part with a heart shape
  function updateNumberOfHearts_v1() {
    let wins = windowManager.getWindows();

    // remove all hearts
    cubes.forEach((h) => {
      world.remove(h);
    });

    cubes = [];
    // add new hearts based on the current window setup
    for (let i = 0; i < wins.length; i++) {
      //   console.log("Creating heart for window:", i);
      let win = wins[i];

      let heartShape = new t.Shape();
      heartShape.moveTo(25, 25);
      heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
      heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
      heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
      heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
      heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
      heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

      let extrudeSettings = {
        depth: 4,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 2,
        bevelThickness: 2,
      };

      let geometry = new t.ExtrudeBufferGeometry(heartShape, extrudeSettings);
      let material = new t.MeshBasicMaterial({
        color: getRandomColorInPink(),
        wireframe: true,
      });
      let heart = new t.Mesh(geometry, material);

      heart.position.x = win.shape.x + win.shape.w * 0.5;
      heart.position.y = win.shape.y + win.shape.h * 0.5;
      heart.scale.setScalar(getRandomScale()); // Set random scale

      world.add(heart);
      cubes.push(heart);
    }
  }
  function updateNumberOfHearts() {
    let wins = windowManager.getWindows();

    // remove all hearts
    cubes.forEach((h) => {
      world.remove(h);
    });

    cubes = [];
    // add new hearts based on the current window setup
    for (let i = 0; i < wins.length; i++) {
      let win = wins[i];

      let heartShape = new t.Shape();
      heartShape.moveTo(25, 25);
      heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
      heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
      heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
      heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
      heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
      heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

      let extrudeSettings = {
        depth: 10, // Increase depth for a more bulging effect
        bevelEnabled: true,
        bevelSegments: 10, // Increase segments for a smoother bevel
        steps: 2,
        bevelSize: 5, // Adjust bevel size for a more pronounced bevel
        bevelThickness: 5, // Adjust bevel thickness for a more pronounced bevel
      };

      let geometry = new t.ExtrudeBufferGeometry(heartShape, extrudeSettings);
      let material = new t.MeshBasicMaterial({
        color: getRandomColorInPink(),
        wireframe: true,
      });
      let heart = new t.Mesh(geometry, material);

      heart.position.x = win.shape.x + win.shape.w * 0.5;
      heart.position.y = win.shape.y + win.shape.h * 0.5;
      heart.scale.setScalar(getRandomScale()); // Set random scale

      world.add(heart);
      cubes.push(heart);
    }
  }

  function getRandomColor() {
    // Generate random color in hexadecimal format
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  function getRandomColorInPink() {
    // Generate a random shade of pink
    let pinkRange = {
      min: 0xff66b2, // Minimum value for pink (lighter)
      max: 0xff1493, // Maximum value for pink (darker)
    };

    // Generate a random color within the specified range
    let randomColor =
      Math.floor(Math.random() * (pinkRange.max - pinkRange.min + 1)) +
      pinkRange.min;

    // Convert the color to hexadecimal format
    return "#" + randomColor.toString(16);
  }

  function getRandomScale() {
    // Generate random scale factor between 0.5 and 2
    return 0.5 + Math.random() * 1.5;
  }

  function updateWindowShape(easing = true) {
    // storing the actual offset in a proxy that we update against in the render function
    sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
    if (!easing) sceneOffset = sceneOffsetTarget;
  }

  function render() {
    let t = getTime();

    windowManager.update();

    // calculate the new position based on the delta between current offset and new offset times a falloff value (to create the nice smoothing effect)
    let falloff = 0.05;
    sceneOffset.x =
      sceneOffset.x + (sceneOffsetTarget.x - sceneOffset.x) * falloff;
    sceneOffset.y =
      sceneOffset.y + (sceneOffsetTarget.y - sceneOffset.y) * falloff;

    // set the world position to the offset
    world.position.x = sceneOffset.x;
    world.position.y = sceneOffset.y;

    let wins = windowManager.getWindows();

    // loop through all our cubes and update their positions based on current window positions
    for (let i = 0; i < cubes.length; i++) {
      let cube = cubes[i];
      let win = wins[i];
      let _t = t; // + i * .2;

      let posTarget = {
        x: win.shape.x + win.shape.w * 0.5,
        y: win.shape.y + win.shape.h * 0.5,
      };

      cube.position.x =
        cube.position.x + (posTarget.x - cube.position.x) * falloff;
      cube.position.y =
        cube.position.y + (posTarget.y - cube.position.y) * falloff;
      cube.rotation.x = _t * 0.5;
      cube.rotation.y = _t * 0.3;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // resize the renderer to fit the window size
  function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}
