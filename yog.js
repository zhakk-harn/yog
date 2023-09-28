const btns = Array.from(document.querySelectorAll(".answer-btn"));
let currentVidSrc = null;
let progressEndedCallbacks = {};
let progressTicking = false;

window.addEventListener("keydown", (event) => {
  const answers = btns.map((btn) => btn.dataset["answer"]);
  const letterPressed = event.key.toLowerCase();

  if (answers.includes(letterPressed)) {
    answer(letterPressed);
  }
});

/**
 * Create a video in the system
 * @param {string} vidSrc - the URI path of the video file
 */
function registerVid(vidSrc) {
  let newVid = document.createElement("video");
  newVid.src = vidSrc;
  newVid.classList.add("hidden");
  document.querySelector("main").appendChild(newVid);

  newVid.addEventListener("ended", () => {
    if (typeof onVideoEnded === "function") {
      const vidShortName = vidSrc.split("/").pop();
      onVideoEnded(vidShortName);
    }
  });

  if (!currentVidSrc) {
    currentVidSrc = vidSrc;
  }
}

function answer(answerKey) {
  if (typeof onAnswer === "function") {
    onAnswer(answerKey);
  }
}

function getCurrentVid() {
  return document.querySelector(`video[src="${currentVidSrc}"]`);
}

/**
 * Launch the playback of a video based on its source path
 * @param {string} vidSrc the URI path of the video file
 */
function playVid(vidSrc) {
  const currentVid = getCurrentVid();
  const newVid = document.querySelector(`video[src="${vidSrc}"]`);

  if (!newVid) {
    throw `${vidSrc} is a video which dosen't exist. Did you register it with registerVid()?`;
  }

  currentVid.classList.add("hidden");
  newVid.classList.remove("hidden");

  currentVid.pause();
  currentVid.currentTime = 0;
  newVid.play();
  currentVidSrc = vidSrc;
}

function getProgressEl() {
  return document.querySelector("progress");
}

function getAsker() {
  return document.querySelector("#asker");
}

/**
 * Start the progress bar and make it progress for totalTime amount of milliseconds
 * @param {number} totalTime - Time in milliseconds
 */
function startProgress(totalTime) {
  let startTime;
  const progressEl = getProgressEl();
  progressTicking = true;

  requestAnimationFrame(progress);

  function progress(timeStamp) {
    if (startTime === undefined) {
      startTime = timeStamp;
    }
    const elapsed = timeStamp - startTime;

    if (progressTicking && elapsed < totalTime) {
      progressEl.value = (elapsed / totalTime) * 100;
      requestAnimationFrame(progress);
    } else if (progressTicking) {
      progressTicking = false;
      progressEl.value = 0;
      execProgressEndedCallbacks();
      if (typeof onProgressEnded === "function") {
        onProgressEnded();
      }
    }
  }
}

/**
 * stops the progress bar
 */
function cancelProgress() {
  const progressEl = getProgressEl();
  progressTicking = false;
  progressEl.value = 0;
}

/**
 * Change the color of the progress bar
 * @param {string} color - the new color for the progress bar, provided in a CSS compliant format
 */
function setProgressColor(color) {
  // TODO : make a separate stylesheet at runtime with a title, only for this
  // instead of doing a shitty nested loop running over all the styles
  for (let stylesheet of document.styleSheets) {
    for (let rule of stylesheet.cssRules) {
      if (
        rule.selectorText.includes("::-moz-progress-bar") ||
        rule.selectorText.includes("::-webkit-progress-value")
      ) {
        rule.style["background-color"] = color;
      }
    }
  }
}

// private
function execProgressEndedCallbacks() {
  const vidShortName = currentVidSrc.split("/").pop();
  Object.values(progressEndedCallbacks).forEach((cb) => {
    // TODO add video name to the callback or something to help them know which video ended
    cb(vidShortName);
  });
}

/**
 * Register a function to be executed when the progress finishes
 * @param {function} callback - function to execute when the progress reach the end.
 * @returns the id of the callback, which you'll have to provide if you want to remove that callback.
 */
function addProgressEndedCallback(callback) {
  let newId;

  do {
    newId = crypto.randomUUID();
  } while (progressEndedCallbacks.newId);

  progressEndedCallbacks[newId] = callback;
  return newId;
}

/**
 * Provide the UUID given by addProgressEndedCallback to stop a particular callback from firing.
 * @param {string} callbackId - a uuid
 */
function removeProgressEndedCallback(callbackId) {
  delete progressEndedCallbacks[callbackId];
}

/**
 * Hides the element holding the questions.
 */
function hideAsker() {
  const asker = getAsker();
  asker.classList.add("slid-down");
}

/**
 * Adds a question to the asker element.
 * @param {string} answerKey - a single character representing the key to press to answer
 * @param {string} answerLabel - the text representing the question
 */
function addQuestion(answerKey, answerLabel) {
  if (typeof answerKey !== "string" || !answerKey.match(/^[a-zA-Z]$/i)) {
    throw (
      "when adding a question you must provide a single letter as the answer key\nyou provided: " +
      answerKey
    );
  }

  const templateQuestion = document.querySelector("#question-template");
  const newQuestion =
    templateQuestion.content.firstElementChild.cloneNode(true);
  newQuestion.querySelector("label").innerText = answerLabel;

  const btn = newQuestion.querySelector("button");
  btn.dataset["answer"] = answerKey;
  btn.innerText = answerKey.toUpperCase();
  btn.addEventListener("click", () => answer(btn.dataset["answer"]));

  document.querySelector("#choices").appendChild(newQuestion);
}

/**
 * Remove a question form the asker element based on the answerKey.
 * @param {string} answerKey - a single character representing the key to press to answer
 */
function removeQuestion(answerKey) {
  const container = document.querySelector("#choices");
  Array.from(container.children).forEach((child) => {
    if (child.querySelector(`button[data-answer=${answerKey}]`)) {
      child.remove();
    }
  });
}

/**
 * Remove a question form the asker element based on the label.
 * @param {string} answerLabel - the text representing the question
 */
function removeQuestionWithLabel(answerLabel) {
  const container = document.querySelector("#choices");
  Array.from(container.children).forEach((child) => {
    if (child.querySelector("label").innerText.includes(answerLabel)) {
      child.remove();
    }
  });
}

/**
 * Remove all the questions from the asker.
 */
function clearQuestions() {
  const container = document.querySelector("#choices");
  Array.from(container.children).forEach((child) => child.remove());
}

/**
 * Show the asker element.
 */
function showAsker() {
  const asker = getAsker();
  asker.classList.remove("slid-down");
}

/**
 * Shows the asker some amount of time before the end of the currently playing video.
 * @param {number} timeFromEnd - time in milliseconds from the end of the video from which we need to start showing the asker
 */
function registerAsker(timeFromEnd) {
  const currentVid = getCurrentVid();

  function handleVideoProgress(progressEvent) {
    const target = progressEvent.target;
    if (target.duration - target.currentTime < timeFromEnd * 0.001) {
      showAsker();
      startProgress(timeFromEnd);
      currentVid.removeEventListener("progress", handleVideoProgress);
    }
  }

  currentVid.addEventListener("timeupdate", handleVideoProgress);
}

/**
 * Helper function to stop your code for some amount of time. Only works inside async functions.
 * @param {milliseconds} time
 * @returns empty Promise
 */
function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
