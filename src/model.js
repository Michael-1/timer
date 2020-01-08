var m = require("mithril");

const STATE = {
  READY: "READY",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  FINISHED: "FINISHED"
};

const model = {
  timeLeft: 10 * 1000,
  originalTime: 10 * 1000,
  endTime: null,
  state: STATE.READY,

  start: function() {
    model.endTime = Date.now() + model.timeLeft;
    model.state = STATE.RUNNING;
    const countdown = setInterval(function() {
      const currentTime = Date.now();
      model.timeLeft = model.endTime - currentTime;
      if (model.timeLeft <= 0) {
        clearInterval(countdown);
        model.state = STATE.FINISHED;
      }
      m.redraw();
    }, 1000);
  }
};

module.exports = { model, STATE };
