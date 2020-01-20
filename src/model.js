var m = require("mithril");

const STATE = {
  READY: "READY",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED"
};

const model = {
  state: STATE.READY,

  setTime: function() {
    model.originalTime = parseInt(this.dataset.time);
    model.intermediateOriginalTime = null;
  },

  setIntermediateTime: function() {
    model.intermediateOriginalTime = parseInt(this.dataset.time);
    console.debug("Set: " + this.dataset.time);
  },

  resetIntermediateTime: function() {
    model.intermediateOriginalTime = null;
    console.debug("Unset: " + this.dataset.time);
  },

  start: function() {
    model.timeLeft = model.originalTime;
    model.run();
  },

  pause: function() {
    model.state = STATE.PAUSED;
    model.timeLeft = model.endTime - Date.now();
    clearTimeout(model.countdown);
  },

  resume: function() {
    model.run();
  },

  run: function() {
    model.state = STATE.RUNNING;
    model.endTime = Date.now() + model.timeLeft;
    model.countdown = setTimeout(function() {
      model.state = STATE.READY;
      clearTimeout(model.countdown);
      m.redraw();
    }, model.timeLeft);
  },
  countdown: null,

  reset: function() {
    model.state = STATE.READY;
    model.timeLeft = null;
  }
};

module.exports = { model, STATE };
