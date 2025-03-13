const countdown = document.querySelector('.countdown');
const photoGallery = document.getElementById('photo-gallery');
const video = document.getElementById('video');
const snapButton = document.getElementById('snapButton');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing the camera: ', error);
  });

let capturedPhotos = []; // Store captured photos

// Function to start the countdown for multiple photos
function startCountdownAndTakePhotos(photoCount) {
  let count = 3;
  let shotsRemaining = photoCount;

  function countdownStep() {
    if (count >= 0) {
      countdown.textContent = count;
      countdown.style.display = 'block';
      countdown.classList.add('countdown-effect');

      setTimeout(() => {
        countdown.classList.remove('countdown-effect');
      }, 900);

      count--;

      setTimeout(countdownStep, 1000);
    } else {
      takePhoto(); // Capture a photo
      shotsRemaining--;

      if (shotsRemaining > 0) {
        count = 3;
        setTimeout(countdownStep, 1000);
      } else {
        // Store photos in localStorage and redirect after last photo
        localStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
        setTimeout(() => {
          window.location.href = 'photo-strip.html'; // Redirect to photo strip page
        }, 1000);
      }
    }
  }

  countdownStep();
}

// Function to take a photo
function takePhoto() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imgSrc = canvas.toDataURL('image/png');
  capturedPhotos.push(imgSrc); // Store image

  // Display in gallery (optional)
  const img = document.createElement('img');
  img.src = imgSrc;
  photoGallery.appendChild(img);
}

// Capture three photos when button is clicked
snapButton.addEventListener('click', () => {
  startCountdownAndTakePhotos(3);
  snapButton.disabled = true;
});
