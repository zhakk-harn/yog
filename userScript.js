let lattestAnswer = null;

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

  lattestAnswer = answerKey;
}

async function onVideoEnded(_vidSrc) {
  await wait(1000);

  showAsker();
  startProgress(2000); // 5000ms

  if (lattestAnswer) {
    if (lattestAnswer == "a") {
      playVid("/assets/FxVsTFmaEAEqiEp.mp4");
    }

    if (lattestAnswer == "b") {
      playVid("/assets/FoK4FIwXoAERu4p.mp4");
    }

    if (lattestAnswer == "c") {
      playVid("/assets/FoK6YxOXEAEX7NP.mp4");
    }
  }
}

function onProgressEnded() {
  hideAsker();
}
