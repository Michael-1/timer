// eslint-disable-next-line no-unused-vars
import m from "mithril";
import { model } from "./model";
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

  view: function() {
    const doc = document.documentElement;
    let layout = LAYOUT.SQUARE;
    if (doc.clientWidth * 3 > doc.clientHeight * 4) layout = LAYOUT.WIDE;
    if (doc.clientWidth * 4 < doc.clientHeight * 3) layout = LAYOUT.HIGH;
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
