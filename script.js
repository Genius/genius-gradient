/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
 *
 * https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
*/
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      resolve(this);
    }
    img.src = url;
  });
}

function readFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);
    reader.readAsDataURL(file);
  });
}

function getBlobFromCanvas(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => resolve(blob));
  });
}

const gradientPromise = loadImage('gradient.png');

document.querySelector('#image-upload').addEventListener('change', async function(event) {
  const file = event.target[0].files[0];
  if (!file) return;

  const fileDataURL = await readFileToDataUrl(file);

  const uploadImage = await loadImage(fileDataURL);
  const gradient = await gradientPromise;

  const height = uploadImage.naturalHeight;
  const width = uploadImage.naturalWidth;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.globalCompositeOperation = "color";

  context.drawImage(uploadImage, 0, 0);
  drawImageProp(context, gradient, 0, 0, width, height);

  const canvasBlob = await getBlobFromCanvas(canvas);
  const objectUrl = URL.createObjectURL(canvasBlob);

  const main = document.querySelector('#main');
  main.style.height = `${height}px`;
  main.style.width = `${width}px`;
  main.style.background = `url(${objectUrl})`;

  const downloadImage = document.querySelector('#download-image');
  downloadImage.setAttribute('href', objectUrl);
  downloadImage.style.display = 'block';  
});