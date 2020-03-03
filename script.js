$(() => {
  $('#image-upload').on('change', function() {
    const file = $(this)[0].files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      $('#main').css('background', `url(https://cl.ly/e6683f9832e7/gradient-01.png), url(${reader.result})`).
                 css('background-size', 'cover');
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  });
});