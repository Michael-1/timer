// eslint-disable-next-line no-unused-vars
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

window.onresize = function() {
  m.redraw();
};

const layout = {
  initialRendering: true,

  onupdate: function() {
    this.initialRendering = false;
  },

  oninit: model.loadSettingsFromStore,

  oncreate: function () {
    if (model.state === STATE.RUNNING) {
      model.resume();
      AnalogClock.animateElements(STATE.READY);
    }
  },

  view: function () {
    const doc = document.documentElement;
    let layout = LAYOUT.SQUARE;
    if (doc.clientWidth * 3 > doc.clientHeight * 4) layout = LAYOUT.WIDE;
    if (doc.clientWidth * 4 < doc.clientHeight * 3) layout = LAYOUT.HIGH;

    const title = "Timer";
    document.title =
      model.state !== STATE.RUNNING
        ? title
        : title + " • " + DigitalClock.formatTime(model.timeLeft).text;

    return (
      <div
        class={
          "layout " +
          `layout--${layout} ` +
          `state--${model.state} ` +
          (model.highlightOnDisabledClick ? "click-on-disabled-flash " : "") +
          (this.initialRendering ? "initial" : "")
        }
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
