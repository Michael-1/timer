var m = require("mithril");

const STATE = {
  READY: "READY",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  FINISHED: "FINISHED"
};

const model = {
  timeLeft: null,
  originalTime: 10 * 1000,
  endTime: null,
  state: STATE.READY,

  start: function() {
    model.timeLeft = model.originalTime;
    model.run();
  },

  pause: function() {
    clearInterval(model.countdown);
    model.state = STATE.PAUSED;
    model.timeLeft = model.endTime - Date.now();
  },

  resume: function() {
    model.run();
  },

  run: function() {
    model.state = STATE.RUNNING;
    model.endTime = Date.now() + model.timeLeft;
    model.countdown = setInterval(function() {
      model.timeLeft = model.endTime - Date.now();
      if (model.timeLeft <= 0) {
        clearInterval(model.countdown);
        model.state = STATE.FINISHED;
      }
      m.redraw();
    }, 1000);
  },
  countdown: null,

  reset: function() {
    model.state = STATE.READY;
    model.timeLeft = null;
  }
};

module.exports = { model, STATE };
