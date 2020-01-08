import m from "mithril";
import { model } from "./model";

import "./analog-clock.scss";

const clockRadius = 50;
const majorTickSize = clockRadius / 5;
const labelFontSize = 8;

const totalTime = 60 * 1000;
const tickUnit = 1000;
const majorTickFrequency = 5 * tickUnit;

export default {
  view: function() {
    const ticks = [];
    for (var time = 0; time < totalTime; time += tickUnit) {
      const rotation = -time * (360 / totalTime);
      const majorTick = !(time % majorTickFrequency);
      ticks.push(
        <line
          class={`tick ${majorTick ? "major" : ""}`}
          x1={clockRadius}
          y1={0}
          x2={clockRadius}
          y2={majorTick ? majorTickSize : majorTickSize - 1}
          transform={`rotate(${rotation},50,50)`}
        />
      );
      if (!majorTick) {
        continue;
      }
      const rotationRad = (rotation / 180) * Math.PI;
      ticks.push(
        <text
          x={
            clockRadius +
            (clockRadius - majorTickSize - labelFontSize / 2 - 2) *
              Math.sin(rotationRad)
          }
          y={
            clockRadius +
            (-clockRadius + majorTickSize + labelFontSize / 2 + 2) *
              Math.cos(rotationRad) +
            1
          }
        >
          {time / tickUnit}
        </text>
      );
    }

    return (
      <svg
        id="analog-clock"
        viewBox={`0 0 ${clockRadius * 2} ${clockRadius * 2}`}
      >
        <path
          class="timeLeft"
          d={`
                    M ${clockRadius} 0
                    A ${clockRadius} ${clockRadius} 0 0 0
                    ${clockRadius -
                      clockRadius *
                        Math.sin((model.timeLeft / totalTime) * 2 * Math.PI)}
                    ${clockRadius -
                      clockRadius *
                        Math.cos((model.timeLeft / totalTime) * 2 * Math.PI)}
                    L ${clockRadius} ${clockRadius}
                    L ${clockRadius} 0
                `}
        />
        <circle cx={clockRadius} cy={clockRadius} r={1} />
        {ticks}
      </svg>
    );
  }
};
