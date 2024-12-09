
let audioElement;
let audioContext;
let analyser;
let dataArray;
let bufferLength;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  // Get the audio element
  audioElement = document.getElementById('audio');

  // Create an AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create a MediaElementSource from the audio element
  let source = audioContext.createMediaElementSource(audioElement);

  // Create an analyser node
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256; // Determines the resolution
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Connect the source to the analyser and to the destination
  source.connect(analyser);
  analyser.connect(audioContext.destination);
}

function draw() {
  background(0, 0, 0, 50); // Semi-transparent background for a smooth effect

  // Get the frequency data
  analyser.getByteFrequencyData(dataArray);

  // Draw the frequency bars
  let barWidth = (width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    let barHeight = dataArray[i];

    // Increase the height of the bars
    barHeight *= 2; // Adjust this multiplier to make bars taller or shorter

    // Optional: Color based on frequency
    let r = barHeight + (25 * (i / bufferLength));
    let g = 250 * (i / bufferLength);
    let b = 50;

    fill(r, g, b);
    rect(x, height - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Resume the audio context if it's suspended (required in some browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}
