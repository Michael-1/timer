import m from "mithril";
import { model, STATE } from "./model";

import "./analog-clock.scss";

const clockRadius = 50;
const majorTickSize = clockRadius / 5;
const minorTickSize = majorTickSize - 1;
const innerClockRadius = clockRadius - minorTickSize;
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
          x1={0}
          y1={-clockRadius}
          x2={0}
          y2={-clockRadius + (majorTick ? majorTickSize : minorTickSize)}
          transform={`rotate(${rotation},0,0)`}
        />
      );
      if (!majorTick) {
        continue;
      }
      const textPosition = polarToCartesian(
        clockRadius - majorTickSize - labelFontSize / 2 - 3,
        -(rotation / 180) * Math.PI
      );
      ticks.push(
        <text x={textPosition.x} y={textPosition.y}>
          {time / tickUnit}
        </text>
      );
    }
    const outerPositionOriginal = polarToCartesian(
      clockRadius,
      (model.originalTime / totalTime) * 2 * Math.PI
    );
    const innerPositionOriginal = polarToCartesian(
      innerClockRadius,
      (model.originalTime / totalTime) * 2 * Math.PI
    );
    const outerPositionLeft = polarToCartesian(
      clockRadius,
      (model.timeLeft / totalTime) * 2 * Math.PI
    );
    const innerPositionLeft = polarToCartesian(
      innerClockRadius,
      (model.timeLeft / totalTime) * 2 * Math.PI
    );
    return (
      <svg
        id="analog-clock"
        viewBox={`0 0 ${clockRadius * 2} ${clockRadius * 2}`}
      >
        <g transform={`translate(${clockRadius} ${clockRadius})`}>
          <path
            class="originalTime"
            d={`
            M 0 ${-clockRadius}
            A ${clockRadius} ${clockRadius} 0 0 0 ${outerPositionOriginal.x} ${
              outerPositionOriginal.y
            }
            L ${innerPositionOriginal.x} ${innerPositionOriginal.y}
            A ${innerClockRadius} ${innerClockRadius} 0 0 1 ${0} ${-innerClockRadius}
            
          `}
          />
          {model.state === STATE.RUNNING && (
            <path
              class="timeLeft"
              d={`
                M 0 ${-clockRadius}
                A ${clockRadius} ${clockRadius} 0 0 0 ${outerPositionLeft.x} ${
                outerPositionLeft.y
              }
                L 0 0
              `}
            />
          )}
          {model.state === STATE.PAUSED && (
            <path
              class="timeLeft"
              d={`
                  M 0 ${-clockRadius}
                  A ${clockRadius} ${clockRadius} 0 0 0 ${
                outerPositionLeft.x
              } ${outerPositionLeft.y}
                L ${innerPositionLeft.x} ${innerPositionLeft.y}
                A ${innerClockRadius} ${innerClockRadius} 0 0 1 ${0} ${-innerClockRadius}
              `}
            />
          )}
          <circle cx={0} cy={0} r={1} />
          {ticks}
        </g>
      </svg>
    );
  }
};

const polarToCartesian = function(radius, angle) {
  return {
    x: -radius * Math.sin(angle),
    y: -radius * Math.cos(angle)
  };
};
