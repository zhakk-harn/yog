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

function registerVid(vidSrc) {
  let newVid = document.createElement("video");
  newVid.src = vidSrc;
  newVid.classList.add("hidden");
  document.querySelector("main").appendChild(newVid);

  newVid.addEventListener("ended", () => {
    if (typeof onVideoEnded === "function") {
      onVideoEnded(vidSrc);
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

function playVid(vidSrc) {
  const currentVid = document.querySelector(`video[src="${currentVidSrc}"]`);
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

function cancelProgress() {
  const progressEl = getProgressEl();
  progressTicking = false;
  progressEl.value = 0;
}

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
  Object.values(progressEndedCallbacks).forEach((cb) => {
    cb();
  });
}

// optionnal
function addProgressEndedCallback(callback) {
  let newId;

  do {
    newId = crypto.randomUUID();
  } while (progressEndedCallbacks.newId);

  progressEndedCallbacks[newId] = callback;
  return newId;
}

// optionnal
function removeProgressEndedCallback(callbackId) {
  delete progressEndedCallbacks[callbackId];
}

function hideAsker() {
  const asker = getAsker();
  asker.classList.add("slid-down");
}

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

function removeQuestion(answerKey) {
  const container = document.querySelector("#choices");
  Array.from(container.children).forEach((child) => {
    if (child.querySelector(`button[data-answer=${answerKey}]`)) {
      child.remove();
    }
  });
}

function removeQuestionWithLabel(answerLabel) {
  const container = document.querySelector("#choices");
  Array.from(container.children).forEach((child) => {
    if (child.querySelector("label").innerText.includes(answerLabel)) {
      child.remove();
    }
  });
}

function clearQuestions() {
  const container = document.querySelector("#choices");
  Array.from(container.children).forEach((child) => child.remove());
}

function showAsker() {
  const asker = getAsker();
  asker.classList.remove("slid-down");
}

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
