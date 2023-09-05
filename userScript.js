hideAsker();

// registerVid(vidSrc)
registerVid("/assets/FxVsTFmaEAEqiEp.mp4");
registerVid("/assets/FoK4FIwXoAERu4p.mp4");
registerVid("/assets/FoK6YxOXEAEX7NP.mp4");

addQuestion("a", "are you still afraid of the dark?");
addQuestion("b", "get out!");
addQuestion("c", "easy, take the nuyens");

playVid("/assets/FxVsTFmaEAEqiEp.mp4");

// answerKey is always lowercase
function onAnswer(answerKey) {
  hideAsker();
  cancelProgress();

  if (answerKey == "a") {
    playVid("/assets/FxVsTFmaEAEqiEp.mp4");
  }

  if (answerKey == "b") {
    playVid("/assets/FoK4FIwXoAERu4p.mp4");
  }

  if (answerKey == "c") {
    playVid("/assets/FoK6YxOXEAEX7NP.mp4");
  }
}

function onVideoEnded(_vidSrc) {
  showAsker();
  startProgress(5000); // 5000ms

  playVid("/assets/FoK6YxOXEAEX7NP.mp4");
}

function onProgressEnded() {
  hideAsker();
}