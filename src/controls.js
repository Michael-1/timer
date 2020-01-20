import m from "mithril";
import { model, STATE } from "./model";

import "./controls.scss";

export default {
  view: function() {
    return (
      <div id="controls">
        <button
          onclick={model.state === STATE.PAUSED ? model.resume : model.start}
          disabled={model.state === STATE.RUNNING || !model.originalTime}
        >
          ▶
        </button>
        <button onclick={model.pause} disabled={model.state !== STATE.RUNNING}>
          ▮▮
        </button>
        <button onclick={model.reset} disabled={model.state !== STATE.PAUSED}>
          ↺
        </button>
      </div>
    );
  }
};
