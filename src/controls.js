// eslint-disable-next-line no-unused-vars
import m from "mithril";
import { model, STATE } from "./model";

import "./controls.scss";

export default {
  view: function() {
    return (
      <div id="controls">
        <button
          id="run"
          title="Run"
          onclick={model.state === STATE.PAUSED ? model.resume : model.start}
          disabled={
            model.state === STATE.RUNNING ||
            (!model.originalTime && !model.intermediateOriginalTime)
          }
        >
          <svg class="icon" viewBox="0 0 32 32">
            <path d="M7 4l20 12-20 12z" />
          </svg>
        </button>
        <button
          id="pause"
          title="Pause"
          onclick={model.pause}
          disabled={model.state !== STATE.RUNNING}
        >
          <svg class="icon" viewBox="0 0 32 32">
            <path d="M4 4h10v24h-10zM18 4h10v24h-10z" />
          </svg>
        </button>
        <button
          id="reset"
          title="Reset"
          onclick={model.reset}
          disabled={model.state === STATE.READY}
          onkeydown={function(e) {
            if (e.key === " ") e.preventDefault();
          }}
        >
          <svg class="icon" viewBox="0 0 32 32">
            <path d="M16 2c-4.418 0-8.418 1.791-11.313 4.687l-4.686-4.687v12h12l-4.485-4.485c2.172-2.172 5.172-3.515 8.485-3.515 6.627 0 12 5.373 12 12 0 3.584-1.572 6.801-4.063 9l2.646 3c3.322-2.932 5.417-7.221 5.417-12 0-8.837-7.163-16-16-16z" />
          </svg>
        </button>
      </div>
    );
  }
};

function timeStep(time) {
  if (time < 60 * 1000) return 1000;
  return 60 * 1000;
}

onkeyup = function(e) {
  if (e.key === " ") {
    if (model.state === STATE.READY) {
      document.getElementById("run").blur();
      model.start();
      return;
    }
    if (model.state === STATE.RUNNING) {
      document.getElementById("pause").blur();
      model.pause();
      return;
    }
    if (model.state === STATE.PAUSED) {
      document.getElementById("run").blur();
      model.resume();
      return;
    }
  }
  if (e.key === "Escape") {
    document.getElementById("reset").blur();
    model.reset();
    return;
  }
};

onkeydown = function(e) {
  if (e.key === " ") {
    if (model.state === STATE.READY) {
      document.getElementById("run").focus();
      return;
    }
    if (model.state === STATE.RUNNING) {
      document.getElementById("pause").focus();
      return;
    }
    if (model.state === STATE.PAUSED) {
      document.getElementById("run").focus();
      return;
    }
  }
  if (e.key === "Escape") {
    document.getElementById("reset").focus();
    return;
  }
  if (model.state === STATE.READY) {
    if (e.key === "ArrowUp") {
      if (model.intermediateOriginalTime)
        model.intermediateOriginalTime += timeStep(
          model.intermediateOriginalTime
        );
      else model.originalTime += timeStep(model.originalTime);
      m.redraw();
      return;
    }
    if (e.key === "ArrowDown") {
      if (model.intermediateOriginalTime)
        model.intermediateOriginalTime -= timeStep(
          --model.intermediateOriginalTime
        );
      else model.originalTime -= timeStep(--model.originalTime);
      m.redraw();
      return;
    }
  }
};
