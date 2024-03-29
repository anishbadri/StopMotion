(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var clickNo = 0

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        // canvas.setAttribute('width', width);
        // canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
        ev.preventDefault();
    }, false);
    
    // clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    // photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var canvasStore = newCanvas();
    var photoOutput = insertImg();
    console.log(canvasStore)
    var context = canvasStore.getContext('2d');
    if (width && height) {
      canvasStore.width = width;
      canvasStore.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvasStore.toDataURL('image/png');
      photoOutput.setAttribute('src', data);
      photo.setAttribute('src', data);
      $(".output").show();
      $(photo).fadeTo('fast', .50);
      display(data);
    } else {
      clearphoto();
    }
  }

  function newCanvas() {
    // $(storage).append()
    var identifier = 'canvas-' + $('canvas').length;  
    $('<canvas>').attr({
      id : identifier
    }).appendTo('.storage')
    // console.log(typeof(`#${identifier}`));
    return ($(`#${identifier}`)[0]);
  }

  function insertImg() {
    var identifier = 'image-' + ($('canvas').length-1);
    $('<img>').attr({
      id: identifier
    }).appendTo('.display');

    return ($(`#${identifier}`)[0]);
  }

  function display(data) {
    $(".display").append('<img id="Image-1"/>');
    // $("#Image-1").setAttribute('src', data);
  }



  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
  window.addEventListener('load', makeGif, false);

  function makeGif() {
    var imgs = document.querySelectorAll('img');

    var ag = new Animated_GIF(); 
    ag.setSize(320, 240);

    for(var i = 0; i < imgs.length; i++) {
      if(i!=0) {
        ag.addFrame(imgs[i]);
      }
    }

    var animatedImage = document.createElement('img');

    // This is asynchronous, rendered with WebWorkers
    ag.getBase64GIF(function(image) {
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
    });
  }
})();
