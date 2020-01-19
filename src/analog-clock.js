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
    const interactiveSegmentPrototypeOuter = polarToCartesian(
      clockRadius,
      (tickUnit / totalTime) * 2 * Math.PI
    );
    const interactiveSegmentPrototypeInner = polarToCartesian(
      innerClockRadius,
      (tickUnit / totalTime) * 2 * Math.PI
    );
    const interactiveSegmentPrototype = `
      M 0 ${-clockRadius}
      A ${clockRadius} ${clockRadius} 0 0 0 ${
      interactiveSegmentPrototypeOuter.x
    } ${interactiveSegmentPrototypeOuter.y}
      L ${interactiveSegmentPrototypeInner.x} ${
      interactiveSegmentPrototypeInner.y
    }
      A ${innerClockRadius} ${innerClockRadius} 0 0 1 ${0} ${-innerClockRadius}
    `;
    const interactiveSegments = [];
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
      interactiveSegments.push(
        <path
          class="interactive-segment"
          d={interactiveSegmentPrototype}
          transform={`rotate(${-(time - tickUnit / 2) *
            (360 / totalTime)},0,0)`}
          onmouseenter={this.setTime}
          data-time={time}
        />
      );
      if (!majorTick) {
        continue;
      }
      const textPosition = polarToCartesian(
        clockRadius - majorTickSize - labelFontSize / 2 - 3,
        -rotation / 360
      );
      ticks.push(
        <text x={textPosition.x} y={textPosition.y}>
          {time / tickUnit}
        </text>
      );
    }
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
            ${drawArc(clockRadius, model.originalTime / totalTime)}
            ${drawArc(innerClockRadius, model.originalTime / totalTime, true)}
          `}
          />
          {model.state === STATE.RUNNING && (
            <g class="timeLeft">
              <circle cx={0} cy={0} r={clockRadius} />
              <circle
                class="negative"
                cx={0}
                cy={0}
                r={clockRadius / 2}
                stroke-width={clockRadius}
                stroke-dasharray={clockRadius * Math.PI}
                stroke-dashoffset={
                  (model.timeLeft / totalTime) * clockRadius * Math.PI
                }
                style={"animation-duration:" + model.timeLeft + "ms"}
              />
            </g>
          )}
          {model.state === STATE.PAUSED && (
            <path
              class="timeLeft"
              d={`
                  M 0 ${-clockRadius}
                  ${drawArc(clockRadius, model.timeLeft / totalTime)}
                  ${drawArc(innerClockRadius, model.timeLeft / totalTime, true)}
              `}
            />
          )}
          <circle class="middleDot" cx={0} cy={0} r={1} />
          {ticks}
          {model.state === STATE.READY && interactiveSegments}
        </g>
      </svg>
    );
  },
  setTime: function() {
    model.setTime(parseInt(this.dataset.time));
  }
};

const polarToCartesian = function(radius, angle) {
  const rad = angle * (2 * Math.PI);
  return {
    x: -radius * Math.sin(rad),
    y: -radius * Math.cos(rad)
  };
};

const drawArc = function(radius, angle, inner) {
  const c = polarToCartesian(radius, angle);
  return `
      ${inner ? `L ${c.x} ${c.y}` : ""}
      A ${radius} ${radius} 0 ${c.x < 0 ? 0 : 1} 
      ${inner ? 1 : 0} ${inner ? 0 : c.x} ${inner ? -radius : c.y}
    `;
};
