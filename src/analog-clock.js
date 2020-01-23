import m from "mithril";
import { model, STATE } from "./model";

import "./analog-clock.scss";

const clockRadius = 50;
const majorTickSize = clockRadius / 5;
const minorTickSize = majorTickSize - 1;
const innerClockRadius = clockRadius - minorTickSize;
const labelFontSize = 7;

const totalTime = 60 * 60 * 1000;
const tickUnit = 60 * 1000;
const majorTickFrequency = 5 * tickUnit;

const clock = {
  view: function() {
    let originalTime =
      model.intermediateOriginalTime || model.originalTime || 0;
    if (originalTime === totalTime) originalTime--;
    let timeLeft = model.timeLeft || 0;
    if (timeLeft === totalTime) timeLeft--;
    const ticks = [];
    const interactiveSegments = [];
    const interactiveSegmentPrototype = `
      M 0 ${-clockRadius}
      ${drawArc(clockRadius, tickUnit / totalTime)}
      ${drawArc(innerClockRadius, tickUnit / totalTime, true)}
    `;
    for (var time = tickUnit; time <= totalTime; time += tickUnit) {
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
          transform={`rotate(${-(time - tickUnit / 2) * (360 / totalTime)})`}
          onmouseenter={clock.setIntermediateTime}
          onmouseleave={clock.resetIntermediateTime}
          onclick={clock.setTime}
          data-time={time}
        />
      );
      if (!majorTick) {
        continue;
      }
      const textPosition = {
        x:
          -(clockRadius - majorTickSize - labelFontSize / 2 - 3) *
          Math.sin((-rotation / 360) * (2 * Math.PI)),
        y:
          -(clockRadius - majorTickSize - labelFontSize / 2 - 2) *
            Math.cos((-rotation / 360) * (2 * Math.PI)) +
          1
      };
      ticks.push(
        <text
          x={textPosition.x}
          y={textPosition.y}
          data-time={time}
          {...(model.state === STATE.READY
            ? {
                class: "interactive",
                onmouseenter: clock.setIntermediateTime,
                onmouseleave: clock.resetIntermediateTime,
                onclick: clock.setTime
              }
            : {})}
        >
          {time / tickUnit}
        </text>
      );
    }

    const endAnimationAttributes = {
      dur: "2000ms",
      begin: "indefinite",
      calcMode: "spline",
      keyTimes: `0;${0.4 + originalTime / (totalTime * 2)};1`,
      keySplines: ".5 0 1 1; 0 0 .5 1"
    };

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
            ${drawArc(clockRadius, originalTime / totalTime)}
            ${drawArc(innerClockRadius, originalTime / totalTime, true)}
          `}
          >
            <animate
              class="animation--end"
              {...endAnimationAttributes}
              attributeName="fill"
              values="transparent;transparent;#ffcece"
            />
          </path>
          <path
            class="timeLeft"
            d={`
              M 0 ${-clockRadius}
              ${drawArc(clockRadius, timeLeft / totalTime)}
              L 0 0
            `}
          >
            <animate
              class="animation--running-ready animation--paused-ready"
              begin="indefinite"
              dur="500ms"
              attributeName="fill"
              from="#ff6161"
              to="#ffcece"
              fill="freeze"
            />
            <animate
              class="animation--ready-running"
              begin="indefinite"
              dur="500ms"
              attributeName="fill"
              to="#ff6161"
              from="#ffcece"
              fill="freeze"
            />
          </path>
          <circle
            class="end-animation"
            cx={0}
            cy={0}
            r={clockRadius / 2}
            stroke-width={clockRadius}
          >
            <animate
              class="animation--end"
              {...endAnimationAttributes}
              attributeName="stroke-dasharray"
              values={
                `0 ${clockRadius * Math.PI};` +
                `${clockRadius * Math.PI} 0;` +
                `${clockRadius * Math.PI} ${clockRadius * Math.PI}`
              }
            />
            <animate
              class="animation--end"
              {...endAnimationAttributes}
              attributeName="stroke-dashoffset"
              values={
                "0;" +
                "0;" +
                (originalTime / totalTime - 1) * clockRadius * Math.PI
              }
            />
            <animate
              class="animation--end"
              {...endAnimationAttributes}
              attributeName="stroke"
              values="#ff6161;#ff6161;#ffcece"
            />
          </circle>
          <circle class="inner-negative" cx={0} cy={0} r={0}>
            <animate
              class="animation--running-paused animation--running-ready"
              begin="indefinite"
              dur="500ms"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0 0 0 1"
              attributeName="r"
              values={"0;" + innerClockRadius}
              fill="freeze"
            />
            <animate
              class="animation--ready-running animation--paused-running"
              begin="indefinite"
              dur="500ms"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="1 0 1 1"
              attributeName="r"
              values={innerClockRadius + ";0"}
              fill="freeze"
            />
            <animate
              class="animation--end"
              {...endAnimationAttributes}
              attributeName="r"
              values={"0;0;" + innerClockRadius}
            />
          </circle>
          <circle class="middleDot" cx={0} cy={0} r={1} />
          {ticks}
          {model.state === STATE.READY && interactiveSegments}
          {model.state !== STATE.READY && (
            <circle
              class="disabled-click-overlay"
              cx={0}
              cy={0}
              r={clockRadius}
              onclick={model.clickOnDisabled}
            />
          )}
        </g>
      </svg>
    );
  },

  setTime: function() {
    model.originalTime = parseInt(this.dataset.time);
    clock.resetIntermediateTime();
  },

  setIntermediateTime: function() {
    model.intermediateOriginalTime = parseInt(this.dataset.time);
  },

  resetIntermediateTime: function() {
    model.intermediateOriginalTime = null;
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

export default clock;
