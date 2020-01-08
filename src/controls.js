import m from "mithril";
import { model, STATE } from "./model";

export default {
  view: function() {
    return (
      <div id="controls">
        <button onclick={model.start} disabled={model.state != STATE.READY}>
          ▶
        </button>
        <button disabled={model.state != STATE.PAUSED}>▮▮</button>
        <button disabled={model.state != STATE.FINISHED}>↺</button>
      </div>
    );
  }
};
