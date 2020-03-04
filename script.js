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

$(() => {
  $('#image-upload').on('change', async function() {
    const file = $(this)[0].files[0];
    if (!file) return;
    
    const fileDataURL = await readFileToDataUrl(file);
    const gradient = await loadImage('https://cdn.glitch.com/fffdd8da-0106-4e08-94ff-81950a79b744%2Fgradient-01.png?v=1583287915356');
    const uploadImage = await loadImage(fileDataURL);

    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "color";

    context.drawImage(uploadImage, 0, 0);  
    context.drawImage(gradient, 0, 0, 1920, 1920 * gradient.height / gradient.width);

    const data = canvas.toDataURL("image/jpeg");

    $('#main').css('background', `url(${data})`);
    $('#download-image').show();      
  });
  
  $('#download-image').click(function() {
    html2canvas($('#main')[0]).then(canvas => {
      canvas.toBlob((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        $('#download-link').attr('href', objectUrl)[0].click();
      });
    });
  });
});