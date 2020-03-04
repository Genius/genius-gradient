$(() => {
  $('#image-upload').on('change', function() {
    const file = $(this)[0].files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // $('#main').css('background', `url(https://cl.ly/e6683f9832e7/gradient-01.png), url(${reader.result})`).
      //            css('background-size', 'cover');
      
      const img = document.createElement("img");
      img.src = 'https://cdn.glitch.com/fffdd8da-0106-4e08-94ff-81950a79b744%2Fgradient-01.png?v=1583287915356';
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        const context = canvas.getContext("2d");
        context.globalCompositeOperation = "color";
        
        const uploadImage = document.createElement('img');
        uploadImage.src = reader.result;
        
        context.drawImage(this, 0, 0, 100, 100 * this.height / this.width)
        context.drawImage(this, 0, 0);
        // context.drawImage(uploadImage, 0, 0);
        const data = canvas.toDataURL("image/jpeg");
        
        $('#main').css('background', `url(${data})`);
        $('#download-image').show();
      };
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
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

;(function(window) {

  var __f = function(obj) {
    if (typeof window[obj] === "undefined") {
      if (typeof console !== "undefined") {
        console.log("Warning: canvas context not supported (" + obj + " needed)");
      }
      return false;
    }
    return true;
  };

  if (!__f("HTMLCanvasElement")) { return; }

  document.addEventListener("DOMContentLoaded", function() {
    var supportsBackgroundBlendMode = window.getComputedStyle(document.body).backgroundBlendMode;
    if(typeof supportsBackgroundBlendMode === "undefined") {  

      // TODO: check for Canvas composite support

      createBlendedBackgrounds();
    }
  }, false);

  var createBlendedBackgrounds = function() {
    var els = document.querySelectorAll("[data-blend]");
    for(var i = 0; i < els.length; i++) {
      var el = els[i],
          type = el.getAttribute("data-blend"),
          image = el.getAttribute("data-blend-image"),
          color = el.getAttribute("data-blend-color");
      processElement(el,type,image,color);
    }
  };

  var processElement = function(el,type,image,color) {
    var backgroundImageURL = image,
        backgroundColor = color;

    createBlendedBackgroundImageFromURLAndColor(backgroundImageURL, backgroundColor, type, function(imgData) {
      el.style.backgroundImage = "url(" + imgData + ")";
    });
  };

  var createBlendedBackgroundImageFromURLAndColor = function(url, color, type, callback) {

    // TODO: add alpha channel

    var img = document.createElement("img");
    img.src = url;
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      var context = canvas.getContext("2d");
      context.globalCompositeOperation = type;
      context.drawImage(this, 0, 0);
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      var data = canvas.toDataURL("image/jpeg");
      callback(data);
    };
  };

})(window);