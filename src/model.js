var m = require("mithril");

const STATE = {
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused"
};

const model = {
  state: STATE.READY,
  timeoutEnd: null,
  countdown: null,

  start: function() {
    model.timeLeft = model.originalTime;
    model.run();
  },

  pause: function() {
    model.state = STATE.PAUSED;
    model.timeLeft = model.endTime - Date.now();
    clearTimeout(model.timeoutEnd);
    clearInterval(model.countdown);
  },

  resume: function() {
    model.run();
  },

  run: function() {
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
  },

  reset: function() {
    model.state = STATE.READY;
    model.timeLeft = null;
    clearTimeout(model.timeoutEnd);
    clearInterval(model.countdown);
  }
};

module.exports = { model, STATE };
