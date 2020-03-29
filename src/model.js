// eslint-disable-next-line no-unused-vars
import m from "mithril";

import bell from "../assets/audio/bell.ogg";

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
  intermediateDigitalOriginalTime: null,
  manualTotalTime: null,
  timeLeft: null,
  endTime: null,

  setTime: function(time) {
    model.originalTime = time;
    model.manualTotalTime = null;
    model.resetIntermediateTime();
  },

  setIntermediateTime: function(time) {
    model.intermediateOriginalTime = time;
  },

  setIntermediateDigitalTime: function(time) {
    model.intermediateDigitalOriginalTime = time;
  },

  resetIntermediateTime: function() {
    model.intermediateOriginalTime = null;
    model.intermediateDigitalOriginalTime = null;
  },

  start: function() {
    model.timeLeft = model.originalTime;
    model.run();
  },

  pause: function() {
    model.clearTimeouts();
    const oldState = model.state;
    model.state = STATE.PAUSED;
    model.timeLeft = model.endTime - Date.now();
    model.animateElements(oldState);
  },

  resume: function() {
    model.run();
  },

  run: function() {
    const oldState = model.state;
    model.state = STATE.RUNNING;
    model.endTime = Date.now() + model.timeLeft;
    this.countdown();
    document.getElementById("time-input").blur();
    model.endTimeout = setTimeout(function() {
      new Audio(bell).play();
      model.timeLeft = 0;
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
    model.countdownTimeout = setTimeout(
      model.countdown,
      model.timeLeft % 1000 || 1000
    );
  },

  reset: function() {
    model.clearTimeouts();
    const oldState = model.state;
    model.state = STATE.READY;
    if (model.timeLeft > 1000) model.animateElements(oldState);
  },

  clearTimeouts: function() {
    clearTimeout(model.endTimeout);
    clearTimeout(model.countdownTimeout);
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

export { model, STATE };
