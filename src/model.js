// eslint-disable-next-line no-unused-vars
import m from "mithril";
import AnalogClock from "./analog-clock";
import DigitalClock from "./digital-clock";

import badge from "../assets/favicon.svg";

import bell_legacy from "../assets/bell/legacy.mp3";
import bell_pascal from "../assets/bell/pascal.mp3";
import bell_ilaria from "../assets/bell/ilaria.mp3";
import bell_michael from "../assets/bell/michael.mp3";

const bells = [bell_legacy, bell_pascal, bell_ilaria, bell_michael];

const STATE = {
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused",
};

const STORED_ITEMS = {
  STATE: "state",
  ORIGINAL_TIME: "original_time",
  END_TIME: "end_time",
  TIME_LEFT: "time_left",
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
  timerEnd: null,
  timerCountdown: null,

  setTime: function (time) {
    model.originalTime = time;
    model.manualTotalTime = null;
    model.resetIntermediateTime();
    localStorage.setItem(STORED_ITEMS.ORIGINAL_TIME, time);
  },

  setIntermediateTime: function (time) {
    model.intermediateOriginalTime = time;
  },

  setIntermediateDigitalTime: function (time) {
    model.intermediateDigitalOriginalTime = time;
  },

  resetIntermediateTime: function () {
    model.intermediateOriginalTime = null;
    model.intermediateDigitalOriginalTime = null;
  },

  start: function () {
    if (!model.originalTime) return;
    model.timeLeft = model.originalTime;
    run();
    Notification.requestPermission();
  },

  pause: function () {
    clearTimeouts();
    setState(STATE.PAUSED);
    model.timeLeft = model.endTime - Date.now();
    localStorage.setItem(STORED_ITEMS.TIME_LEFT, model.timeLeft);
  },

  resume: function () {
    run();
  },

  reset() {
    clearTimeouts();
    setState(STATE.READY);
  },

  clickOnDisabled() {
    model.highlightOnDisabledClick = true;
    setTimeout(function () {
      model.highlightOnDisabledClick = false;
    }, 500);
  },

  loadSettingsFromStore() {
    model.originalTime = parseInt(
      localStorage.getItem(STORED_ITEMS.ORIGINAL_TIME)
    );
    const storedState = localStorage.getItem(STORED_ITEMS.STATE);
    if (storedState) {
      setState(storedState);
      if (storedState === STATE.RUNNING) {
        model.endTime = parseInt(localStorage.getItem(STORED_ITEMS.END_TIME));
        if (model.endTime > Date.now()) {
          model.timeLeft = model.endTime - Date.now();
        } else {
          setState(STATE.READY);
        }
      } else if (storedState === STATE.PAUSED)
        model.timeLeft = parseInt(localStorage.getItem(STORED_ITEMS.TIME_LEFT));
    }
  },
};

function run() {
  setState(STATE.RUNNING);
  model.endTime = Date.now() + model.timeLeft;
  localStorage.setItem(STORED_ITEMS.END_TIME, model.endTime);
  countdown();
  document.getElementById("time-input").blur();
  model.timerEnd = setTimeout(end, model.timeLeft);
}

function countdown() {
  model.timeLeft = model.endTime - Date.now();
  m.redraw();
  model.timerCountdown = setTimeout(countdown, model.timeLeft % 1000 || 1000);
}

function end() {
  new Audio(bells[Math.floor(Math.random() * bells.length)]).play();
  new Notification("🕛", {
    body: DigitalClock.formatTime(model.originalTime).text,
    badge,
    icon: badge,
    vibrate: true,
    requireInteraction: true,
  });
  model.timeLeft = 0;
  model.reset();
  m.redraw();
  for (let el of document.getElementsByClassName(`animation--end`))
    el.beginElement();
}

function clearTimeouts() {
  clearTimeout(model.timerEnd);
  clearTimeout(model.timerCountdown);
}

function setState(state) {
  const oldState = model.state;
  model.state = state;
  AnalogClock.animateElements(oldState);
  localStorage.setItem(STORED_ITEMS.STATE, state);
}

export { model, STATE };
