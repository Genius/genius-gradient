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

function fitImageToDimensions({image, height, width}) {
  const div = $('<div>').
    css('display', 'none').
    css('height', height).
    css('width', width).
    css('background', `url(${image.src})`);
}

const HEIGHT = 1080;
const WIDTH = 1920;

const GRADIENT = loadImage('https://cdn.glitch.com/fffdd8da-0106-4e08-94ff-81950a79b744%2Fgradient-01.png?v=1583287915356');

$(() => {
  $('#image-upload').on('change', async function() {
    const file = $(this)[0].files[0];
    if (!file) return;
    
    const fileDataURL = await readFileToDataUrl(file);
    
    const uploadImage = await loadImage(fileDataURL);
    const gradient = await GRADIENT;
    
    if (uploadImage.naturalHeight !== HEIGHT || uploadImage.naturalWidth !== WIDTH) {
      return alert(`Image must be exactly ${WIDTH}x${HEIGHT}!`);
    }

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "color";

    context.drawImage(uploadImage, 0, 0, WIDTH, WIDTH * gradient.height / gradient.width);  
    context.drawImage(gradient, 0, 0, WIDTH, WIDTH * gradient.height / gradient.width);

    const canvasBlob = await getBlobFromCanvas(canvas);
    const objectUrl = URL.createObjectURL(canvasBlob);

    $('#main').
      css('height', `${HEIGHT}px`).
      css('width', `${WIDTH}px`).
      css('background', `url(${objectUrl})`);
    $('#download-image').attr('href', objectUrl).show();      
  });
});