import m from "mithril";
import { model, STATE } from "./model";

import "./controls.scss";

export default {
  view: function() {
    return (
      <div id="controls">
        <button
          id="run"
          onclick={model.state === STATE.PAUSED ? model.resume : model.start}
          disabled={
            model.state === STATE.RUNNING ||
            (!model.originalTime && !model.intermediateOriginalTime)
          }
        >
          <svg class="icon" viewBox="0 0 32 32">
            <path d="M8 3l21 11-21 11z" />
          </svg>
        </button>
        <button
          id="pause"
          onclick={model.pause}
          disabled={model.state !== STATE.RUNNING}
        >
          <svg class="icon" viewBox="0 0 32 32">
            <path d="M4 3h10v23h-10zM18 3h10v23h-10z" />
          </svg>
        </button>
        <button
          id="revert"
          onclick={model.reset}
          disabled={model.state === STATE.READY}
        >
          <svg class="icon" viewBox="0 0 32 32">
            <path d="M16 2c-4.418 0-8.418 1.791-11.313 4.687l-4.686-4.687v12h12l-4.485-4.485c2.172-2.172 5.172-3.515 8.485-3.515 6.627 0 12 5.373 12 12 0 3.584-1.572 6.801-4.063 9l2.646 3c3.322-2.932 5.417-7.221 5.417-12 0-8.837-7.163-16-16-16z" />
          </svg>
        </button>
      </div>
    );
  }
};
