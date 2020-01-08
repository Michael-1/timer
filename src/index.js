import m from "mithril";
import AnalogClock from "./analog-clock";
import DigitalClock from "./digital-clock";
import Controls from "./controls";

import "./layout.scss";

const layout = {
  view: function() {
    return (
      <div>
        <AnalogClock />
        <DigitalClock />
        <Controls />
      </div>
    );
  }
};

m.mount(document.body, layout);
