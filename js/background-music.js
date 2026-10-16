/* Local, looping background soundtrack.
   Add the user's own MP3 at music/background-music.mp3. */
(function () {
  window.TS = window.TS || {};

  const SOURCE = 'music/background-music.mp3';
  let audio = null;
  let missingMessageShown = false;
  let autoplayNoticeShown = false;
  let waitingForGesture = false;
  let gestureHandler = null;
  let initialAttemptMade = false;

  function settings() {
    return window.TS.Storage.get().settings;
  }

  function volumeValue() {
    const value = Number(settings().backgroundMusicVolume);
    return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 15)) / 100;
  }

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio(SOURCE);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volumeValue();
    audio.addEventListener('error', reportMissingFile);
    return audio;
  }

  function reportMissingFile() {
    if (missingMessageShown) return;
    missingMessageShown = true;
    if (window.TS.UI) {
      window.TS.UI.toast(
        'Background music file not found',
        'Add your MP3 as music/background-music.mp3, then reload TypeStrike.',
        'error'
      );
    }
  }

  function stopWaitingForGesture() {
    if (!waitingForGesture || !gestureHandler) return;
    window.removeEventListener('pointerdown', gestureHandler, true);
    window.removeEventListener('keydown', gestureHandler, true);
    window.removeEventListener('touchstart', gestureHandler, true);
    waitingForGesture = false;
    gestureHandler = null;
  }

  function waitForUserGesture() {
    if (waitingForGesture || !settings().backgroundMusic) return;
    waitingForGesture = true;
    gestureHandler = function () {
      stopWaitingForGesture();
      if (settings().backgroundMusic) playFromUserGesture();
    };
    window.addEventListener('pointerdown', gestureHandler, true);
    window.addEventListener('keydown', gestureHandler, true);
    window.addEventListener('touchstart', gestureHandler, true);
  }

  function handlePlayError(error) {
    if (error && error.name === 'NotAllowedError') {
      waitForUserGesture();
      // Autoplay restrictions are normal; avoid showing repeated toasts on startup.
      if (!autoplayNoticeShown && window.TS.UI) {
        autoplayNoticeShown = true;
        window.TS.UI.toast('Ready when you are', 'Your browser may need one click or key press before the background music can start.', 'info');
      }
      return;
    }
    reportMissingFile();
  }

  function playFromUserGesture() {
    if (!settings().backgroundMusic) return Promise.resolve(false);
    const player = ensureAudio();
    player.volume = volumeValue();
    stopWaitingForGesture();
    let result;
    try {
      result = player.play();
    } catch (error) {
      handlePlayError(error);
      return Promise.resolve(false);
    }
    if (result && typeof result.then === 'function') {
      return result.then(() => true).catch(function (error) {
        handlePlayError(error);
        return false;
      });
    }
    return Promise.resolve(true);
  }

  function pause() {
    stopWaitingForGesture();
    if (audio) audio.pause();
  }

  function setVolume(value) {
    const number = Number(value);
    const volume = Math.max(0, Math.min(100, Number.isFinite(number) ? number : 15));
    if (audio) audio.volume = volume / 100;
  }

  function applySettings() {
    const current = settings();
    const player = ensureAudio();
    player.volume = volumeValue();
    if (!current.backgroundMusic) {
      player.pause();
      stopWaitingForGesture();
    } else if (player.paused && initialAttemptMade) {
      // If the user re-enabled music from Settings, the change handler starts playback
      // directly within the user gesture. Otherwise resume on the next user gesture.
      waitForUserGesture();
    }
  }

  function init() {
    ensureAudio();
    if (!settings().backgroundMusic) return;
    // Try immediately so browsers that allow local autoplay can start the soundtrack.
    // If playback is blocked, the first user gesture starts it without another settings visit.
    initialAttemptMade = true;
    playFromUserGesture();
  }

  window.TS.BackgroundMusic = {
    source: SOURCE,
    init: init,
    applySettings: applySettings,
    playFromUserGesture: playFromUserGesture,
    pause: pause,
    setVolume: setVolume
  };
})();
