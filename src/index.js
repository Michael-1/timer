import m from "mithril";
import { model, STATE } from "./model";
import AnalogClock from "./analog-clock";
import DigitalClock from "./digital-clock";
import Controls from "./controls";

import "./layout.scss";

const LAYOUT = {
  HIGH: "high",
  WIDE: "wide",
  SQUARE: "square"
};

window.onresize = function(event) {
  m.redraw();
};

const layout = {
  view: function() {
    const doc = document.documentElement;
    let layout = LAYOUT.SQUARE;
    if (doc.clientWidth * 3 > doc.clientHeight * 4) layout = LAYOUT.WIDE;
    if (doc.clientWidth * 4 < doc.clientHeight * 3) layout = LAYOUT.HIGH;
    return (
      <div
        class={`layout layout--${layout} state--${model.state} ${
          model.highlightOnDisabledClick ? "click-on-disabled-flash" : ""
        }`}
        style={`height:${doc.clientHeight}px`}
      >
        <AnalogClock />
        <div class="controls-container">
          <DigitalClock />
          <Controls />
        </div>
      </div>
    );
  }
};

m.mount(document.body, layout);

document.onkeyup = function(e) {
  if (e.key === " ") {
    if (model.state === STATE.READY) {
      model.start();
      return;
    }
    if (model.state === STATE.RUNNING) {
      model.pause();
      m.redraw();
      return;
    }
    if (model.state === STATE.PAUSED) {
      model.resume();
      return;
    }
  }
  if (e.key === "Escape") {
    model.reset();
    m.redraw();
    return;
  }
};

document.onkeydown = function(e) {
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
};
