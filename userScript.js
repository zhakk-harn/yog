let lattestAnswer = null;

hideAsker();

// registerVid(vidSrc)
registerVid("/assets/bbb_short.m4v");
registerVid("/assets/FxVsTFmaEAEqiEp.mp4");
registerVid("/assets/FoK4FIwXoAERu4p.mp4");
registerVid("/assets/FoK6YxOXEAEX7NP.mp4");

addQuestion("a", "are you still afraid of the dark?");
addQuestion("b", "get out!");
addQuestion("c", "easy, take the nuyens");

// TODO should not be in yog.js and coll a userscript start()
document.querySelector("dialog button"),
  addEventListener("click", () => {
    document.querySelector("dialog").close();
    playVid("/assets/bbb_short.m4v");
    registerAsker(5000);
  });

// answerKey is always lowercase
function onAnswer(answerKey) {
  hideAsker();

  lattestAnswer = answerKey;
}

function onVideoEnded(_vidName) {
  console.log({ lattestAnswer });

  switch (lattestAnswer) {
    case "a":
      playVid("/assets/FxVsTFmaEAEqiEp.mp4");

      addQuestion("i", "are you still afraid of the dark?");
      addQuestion("k", "get out!");
      addQuestion("l", "easy, take the nuyens");

      registerAsker(200);
      break;
    case "b":
      playVid("/assets/FoK4FIwXoAERu4p.mp4");

      addQuestion("d", "are you still afraid of the dark?");
      addQuestion("e", "get out!");
      addQuestion("f", "easy, take the nuyens");

      registerAsker(200);
      break;
    case "c":
      playVid("/assets/FoK6YxOXEAEX7NP.mp4");

      addQuestion("g", "are you still afraid of the dark?");
      addQuestion("h", "get out!");
      addQuestion("i", "easy, take the nuyens");

      registerAsker(200);
      break;
    default:
      console.log("no/unused answer");
  }
}

function onProgressEnded(_vidName) {
  hideAsker();
}
