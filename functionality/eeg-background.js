/**
 * Sleep EEG-like animated background
 * Simulates NREM sleep EEG - 30 second epoch display
 * Clean, smooth waveforms like clinical polysomnography
 */

(function() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Configuration
  const config = {
    numChannels: 6,
    epochSeconds: 30,        // Standard 30-second sleep epoch
    lineWidth: 1.5,
    opacity: 0.18,
    verticalPadding: 0.08,
    colors: [
      'rgba(248, 113, 113, OPACITY)', // red
      'rgba(56, 189, 248, OPACITY)',  // blue
      'rgba(248, 113, 113, OPACITY)', // red
      'rgba(56, 189, 248, OPACITY)',  // blue
      'rgba(248, 113, 113, OPACITY)', // red
      'rgba(56, 189, 248, OPACITY)',  // blue
    ]
  };

  let channels = [];
  let offset = 0;
  let animationId;
  let pixelsPerSecond;
  let lastTime = 0;
  const targetScrollPixelsPerSecond = 20; // Consistent speed regardless of refresh rate

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calculate pixels per second based on 30-second epoch across screen width
    pixelsPerSecond = canvas.width / config.epochSeconds;

    initChannels();
  }

  function initChannels() {
    channels = [];
    const usableHeight = canvas.height * (1 - 2 * config.verticalPadding);
    const channelHeight = usableHeight / config.numChannels;
    const startY = canvas.height * config.verticalPadding;

    for (let i = 0; i < config.numChannels; i++) {
      // Create smooth, realistic sleep EEG components
      const channel = {
        y: startY + channelHeight * (i + 0.5),
        amplitude: channelHeight * 0.35,
        color: config.colors[i % config.colors.length].replace('OPACITY', config.opacity.toString()),

        // Delta waves (0.5-2 Hz) - dominant in deep sleep, large amplitude
        // Using 2-3 components for natural variation
        delta: [
          { freq: 0.5 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2, amp: 0.5 },
          { freq: 0.8 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2, amp: 0.35 },
          { freq: 1.2 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, amp: 0.25 },
        ],

        // Theta waves (4-7 Hz) - moderate amplitude
        theta: [
          { freq: 4 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2, amp: 0.6 },
          { freq: 5.5 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2, amp: 0.4 },
        ],

        // Alpha waves (8-12 Hz) - low amplitude in sleep
        alpha: [
          { freq: 9 + Math.random() * 2, phase: Math.random() * Math.PI * 2, amp: 1.0 },
        ],

        // Beta waves (13-25 Hz) - minimal
        beta: [
          { freq: 15 + Math.random() * 5, phase: Math.random() * Math.PI * 2, amp: 1.0 },
        ],

        // Amplitude modulation for natural waxing/waning
        modFreq: 0.05 + Math.random() * 0.03,
        modPhase: Math.random() * Math.PI * 2,
      };

      channels.push(channel);
    }
  }

  // Convert frequency (Hz) to radians per pixel
  function hzToRadsPerPixel(hz) {
    return (2 * Math.PI * hz) / pixelsPerSecond;
  }

  // Sum oscillators for a frequency band
  function sumBand(oscillators, x) {
    let sum = 0;
    for (const osc of oscillators) {
      const radsPerPixel = hzToRadsPerPixel(osc.freq);
      sum += Math.sin(x * radsPerPixel + osc.phase) * osc.amp;
    }
    return sum;
  }

  // Generate EEG value at position x for a channel
  function getEEGValue(x, channel) {
    const { amplitude, modFreq, modPhase } = channel;

    // Slow amplitude modulation (natural waxing/waning of sleep waves)
    const modRads = hzToRadsPerPixel(modFreq);
    const modulation = 0.75 + 0.25 * Math.sin(x * modRads + modPhase);

    // Amplitude weights based on NREM sleep EEG
    // Delta dominant, theta moderate, alpha/beta minimal
    const deltaWeight = 1.0;
    const thetaWeight = 0.25;
    const alphaWeight = 0.08;
    const betaWeight = 0.04;

    // Sum all frequency bands
    let value = 0;
    value += sumBand(channel.delta, x) * deltaWeight;
    value += sumBand(channel.theta, x) * thetaWeight;
    value += sumBand(channel.alpha, x) * alphaWeight;
    value += sumBand(channel.beta, x) * betaWeight;

    // Apply modulation and amplitude
    return value * modulation * amplitude;
  }

  function draw(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const step = 1; // 1 pixel steps for smooth lines

    channels.forEach((channel) => {
      ctx.beginPath();
      ctx.strokeStyle = channel.color;
      ctx.lineWidth = config.lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (let x = 0; x <= width; x += step) {
        const signalX = x + offset;
        const y = channel.y + getEEGValue(signalX, channel);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    });

    // Scroll right to left - time-based for consistent speed across refresh rates
    offset += targetScrollPixelsPerSecond * deltaTime;
  }

  function animate(currentTime) {
    // Calculate delta time in seconds
    const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0;
    lastTime = currentTime;

    draw(deltaTime);
    animationId = requestAnimationFrame(animate);
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      lastTime = 0; // Reset to avoid jump when returning
      animationId = requestAnimationFrame(animate);
    }
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  resize();
  animationId = requestAnimationFrame(animate);
})();
