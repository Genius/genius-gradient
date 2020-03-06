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
    css('background-size', 'cover').
    css('background', `url(${image.src})`).
    appendTo(document.body);
  
  return new Promise((resolve, reject) => {
    html2canvas(div[0]).then(canvas => {
     loadImage(canvas.toDataURL('image/png')).then((img) => resolve(img));
    });
  });
}

const GRADIENT = loadImage('https://cdn.glitch.com/fffdd8da-0106-4e08-94ff-81950a79b744%2Fgradient-01.png?v=1583287915356');

$(() => {
  $('#image-upload').on('change', async function() {
    const file = $(this)[0].files[0];
    if (!file) return;
    
    const fileDataURL = await readFileToDataUrl(file);
    
    let uploadImage = await loadImage(fileDataURL);
    let gradient = await GRADIENT;
    let height, width;
    
    if (uploadImage.naturalHeight <= gradient.naturalHeight) {
      height = uploadImage.naturalHeight;
      width = uploadImage.naturalWidth;
      
      gradient = await fitImageToDimensions({
        image: gradient,
        height: uploadImage.naturalHeight,
        width: uploadImage.naturalWidth
      });
    } else {
      height = gradient.naturalHeight;
      width = gradient.naturalWidth;
      
      uploadImage = await fitImageToDimensions({
        image: uploadImage,
        height: gradient.naturalHeight,
        width: gradient.naturalWidth
      });
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "color";

    context.drawImage(uploadImage, 0, 0);  
    context.drawImage(gradient, 0, 0);

    const canvasBlob = await getBlobFromCanvas(canvas);
    const objectUrl = URL.createObjectURL(canvasBlob);

    $('#main').
      css('height', `${height}px`).
      css('width', `${width}px`).
      css('background', `url(${objectUrl})`);
    $('#download-image').attr('href', objectUrl).show();      
  });
});