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
  timeoutEnd: null,
  countdown: null,

  start: function() {
    model.timeLeft = model.originalTime;
    model.run();
  },

  pause: function() {
    const oldState = model.state;
    model.state = STATE.PAUSED;
    model.timeLeft = model.endTime - Date.now();
    clearTimeout(model.timeoutEnd);
    clearInterval(model.countdown);
    model.animateElements(oldState, model.state);
  },

  resume: function() {
    model.run();
  },

  run: function() {
    const oldState = model.state;
    model.state = STATE.RUNNING;
    model.endTime = Date.now() + model.timeLeft;
    model.countdown = setInterval(function() {
      model.timeLeft = model.endTime - Date.now();
      m.redraw();
    }, 1000);
    model.timeoutEnd = setTimeout(function() {
      model.reset();
      m.redraw();
    }, model.timeLeft);
    model.animateElements(oldState, model.state);
  },

  reset: function() {
    const oldState = model.state;
    model.state = STATE.READY;
    model.timeLeft = null;
    clearTimeout(model.timeoutEnd);
    clearInterval(model.countdown);
    model.animateElements(oldState, model.state);
  },

  clickOnDisabled: function() {
    model.highlightOnDisabledClick = true;
    setTimeout(function() {
      model.highlightOnDisabledClick = false;
    }, 500);
  },

  animateElements(oldState, newState) {
    for (let el of document.getElementsByClassName(
      `animation--${oldState}-${newState}`
    ))
      el.beginElement();
  }
};

module.exports = { model, STATE };
