var m = require("mithril");

const STATE = {
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused"
};

const model = {
  state: STATE.READY,
  highlightOnDisabledClick: false,
  originalTime: null,
  intermediateOriginalTime: null,
  timeLeft: null,
  endTime: null,

  timeoutCountdown: null,
  timeoutEnd: null,

  start: function() {
    model.timeLeft = model.originalTime;
    model.run();
  },

  pause: function() {
    const oldState = model.state;
    model.state = STATE.PAUSED;
    model.timeLeft = model.endTime - Date.now();
    window.clearTimeout(model.timeoutEnd);
    window.clearTimeout(model.timeoutCountdown);
    model.animateElements(oldState);
  },

  resume: function() {
    model.run();
  },

  run: function() {
    const oldState = model.state;
    model.state = STATE.RUNNING;
    model.endTime = Date.now() + model.timeLeft;
    model.countdown();
    model.timeoutEnd = window.setTimeout(function() {
      new Audio("bell.ogg").play();
      model.reset();
      m.redraw();
      for (let el of document.getElementsByClassName(`animation--end`))
        el.beginElement();
    }, model.timeLeft);
    model.animateElements(oldState);
  },

  countdown: function() {
    model.timeLeft = model.endTime - Date.now();
    m.redraw();
    model.timeoutCountdown = window.setTimeout(
      model.countdown,
      model.timeLeft % 1000
    );
  },

  reset: function() {
    const oldState = model.state;
    model.state = STATE.READY;
    window.clearTimeout(model.timeoutEnd);
    window.clearTimeout(model.timeoutCountdown);
    if (model.timeLeft > 1000) model.animateElements(oldState);
  },

  clickOnDisabled: function() {
    model.highlightOnDisabledClick = true;
    setTimeout(function() {
      model.highlightOnDisabledClick = false;
    }, 500);
  },

  animateElements(oldState) {
    for (let el of document.getElementsByClassName(
      `animation--${oldState}-${model.state}`
    ))
      el.beginElement();
  }
};

module.exports = { model, STATE };
