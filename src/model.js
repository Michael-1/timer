// eslint-disable-next-line no-unused-vars
import m from "mithril";
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
};

function run() {
  setState(STATE.RUNNING);
  model.endTime = Date.now() + model.timeLeft;
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
  animateElements(oldState);
}

function animateElements(oldState) {
  for (let el of document.getElementsByClassName(
    `animation--${oldState}-${model.state}`
  ))
    el.beginElement();
}

export { model, STATE };
