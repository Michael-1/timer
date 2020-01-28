import m from "mithril";
import { model, STATE } from "./model";
import FadingPath from "./analog-clock-path";
import FadingLabel from "./analog-clock-label";

import "./analog-clock.scss";

const clockRadius = 50;
const majorTickSize = clockRadius / 5;
const minorTickSize = majorTickSize - 1;
const innerClockRadius = clockRadius - minorTickSize;
const outerClockRadius = clockRadius + 1;
const labelFontSize = 7;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const clock = {
  totalTime: HOUR,
  tickFrequency: MINUTE,
  majorTickFrequency: 5 * MINUTE,
  labelUnit: MINUTE,

  interactionsOn: true,

  onbeforeupdate: function(vnode, old) {
    if (vnode.state.totalTime !== old.state.totalTime)
      clock.interactionsOn = false;
  },

  view: function() {
    // Clock scaling
    if (model.originalTime) {
      this.totalTime = Math.ceil(model.originalTime / HOUR) * HOUR;
      this.tickFrequency = 15 * MINUTE;
      this.majorTickFrequency = HOUR;
      this.labelUnit = HOUR;
      if (model.originalTime <= 2 * HOUR) {
        this.tickFrequency = MINUTE;
        this.majorTickFrequency = 10 * MINUTE;
        this.labelUnit = MINUTE;
      }
      if (model.originalTime <= HOUR) {
        this.majorTickFrequency = 5 * MINUTE;
      }
      if (model.originalTime <= 10 * MINUTE) {
        this.totalTime = 10 * MINUTE;
        this.tickFrequency = 10 * SECOND;
        this.majorTickFrequency = 1 * MINUTE;
      }
      if (model.originalTime <= MINUTE) {
        this.totalTime = MINUTE;
        this.tickFrequency = SECOND;
        this.majorTickFrequency = 15 * SECOND;
        this.labelUnit = SECOND;
      }
    }

    // Define sources
    let originalTime =
      model.intermediateOriginalTime || model.originalTime || 0;
    let timeLeft = model.timeLeft || 0;
    if (timeLeft === this.totalTime) timeLeft--;

    // Prepare ticks and labels
    const ticks = [];
    const interactiveSegments = [];
    const interactiveSegmentPrototype = `
      M 0 ${-clockRadius}
      ${drawArc(clockRadius, this.tickFrequency / this.totalTime)}
      ${drawArc(innerClockRadius, this.tickFrequency / this.totalTime, true)}
    `;
    for (let time = 0; time <= this.totalTime; time += this.tickFrequency) {
      const rotation = -time * (360 / this.totalTime);
      const majorTick = !(time % this.majorTickFrequency);
      ticks.push(
        <FadingPath
          class={`tick ${majorTick ? "major" : ""}`}
          d={
            `M 0 ${-clockRadius}` +
            `v ${
              !majorTick && (time / this.labelUnit) % 5
                ? minorTickSize
                : majorTickSize
            }`
          }
          style={`transform:rotate(${rotation}deg)`}
          key={"line_" + time}
          data-time={time}
        />
      );
      if (model.state === STATE.READY && time !== 0) {
        interactiveSegments.push(
          <path
            class="interactive-segment"
            d={interactiveSegmentPrototype}
            transform={`rotate(${-(time - this.tickFrequency / 2) *
              (360 / this.totalTime)})`}
            onmouseenter={clock.setIntermediateTime}
            onmouseleave={clock.resetIntermediateTime}
            onclick={clock.setTime}
            data-time={time}
          />
        );
      }
      if (!majorTick || time === this.totalTime) {
        continue;
      }
      const labelText = (time / this.labelUnit).toString();
      const textPosition = {
        x:
          -(
            clockRadius -
            majorTickSize -
            labelFontSize * labelText.length * 0.3 -
            3
          ) * Math.sin((-rotation / 360) * (2 * Math.PI)),
        y:
          -(clockRadius - majorTickSize - labelFontSize / 2 - 2) *
            Math.cos((-rotation / 360) * (2 * Math.PI)) +
          1
      };
      ticks.push(
        <FadingLabel
          key={"label_" + time + "_" + labelText}
          x={textPosition.x}
          y={textPosition.y}
          data-time={time || this.totalTime}
          data-totaltime={this.totalTime}
          {...(model.state === STATE.READY
            ? {
                class: "interactive",
                onmouseenter: clock.setIntermediateTime,
                onmouseleave: clock.resetIntermediateTime,
                onclick: clock.setTime
              }
            : {})}
        >
          {labelText}
        </FadingLabel>
      );
    }

    const endAnimationAttributes = {
      dur: "2000ms",
      begin: "indefinite",
      calcMode: "spline",
      keyTimes: `0;${0.4 + model.originalTime / (this.totalTime * 2)};1`,
      keySplines: ".5 0 1 1; 0 0 .5 1"
    };

    // Put it all together and draw fills
    return (
      <svg
        id="analog-clock"
        viewBox={`${-clockRadius} ${-clockRadius} ${clockRadius *
          2} ${clockRadius * 2}`}
      >
        {" "}
        <g
          class={
            "originalTime" +
            (model.intermediateOriginalTime ? " intermediate" : "")
          }
        >
          <circle cx={0} cy={0} r={clockRadius}>
            <animate
              class="animation--end"
              {...endAnimationAttributes}
              attributeName="fill"
              values="transparent;transparent;#ffcece"
            />
          </circle>
          <circle
            class="negative"
            cx={0}
            cy={0}
            r={outerClockRadius / 2}
            stroke-width={outerClockRadius}
            stroke-dasharray={outerClockRadius * Math.PI}
            stroke-dashoffset={
              (originalTime < this.totalTime
                ? originalTime / this.totalTime
                : 1 - Number.EPSILON) * // –ε fights layout bug in Chrome
              outerClockRadius *
              Math.PI
            }
          />
        </g>
        {originalTime > this.totalTime && (
          <FadingPath
            class="overshoot-indicator"
            d={
              `M 0 ${-outerClockRadius}` +
              `v ${minorTickSize + 2}` +
              `A ${innerClockRadius - 1} ${innerClockRadius - 1} 0 0 1 ` +
              polarToCartesian(
                innerClockRadius - 1,
                -minorTickSize / (clockRadius * 2 * Math.PI)
              ) +
              // First arrow
              `L ${polarToCartesian(
                clockRadius - minorTickSize / 2,
                -(minorTickSize * 0.5) / (clockRadius * 2 * Math.PI)
              )}` +
              `L ${polarToCartesian(
                outerClockRadius,
                -minorTickSize / (clockRadius * 2 * Math.PI)
              )}` +
              `A ${outerClockRadius} ${outerClockRadius} 0 0 0 0 ${-outerClockRadius}` +
              "Z" +
              `M ` +
              polarToCartesian(
                outerClockRadius,
                (-minorTickSize * 1.5) / (clockRadius * 2 * Math.PI)
              ) +
              // Second arrow
              `L ${polarToCartesian(
                clockRadius - minorTickSize / 2,
                (-minorTickSize * 1.0) / (clockRadius * 2 * Math.PI)
              )}` +
              `L ${polarToCartesian(
                innerClockRadius - 1,
                (-minorTickSize * 1.5) / (clockRadius * 2 * Math.PI)
              )}` +
              `A ${innerClockRadius - 1} ${innerClockRadius - 1} 0 0 1 ` +
              polarToCartesian(
                innerClockRadius - 1,
                (-minorTickSize * 2.0) / (clockRadius * 2 * Math.PI)
              ) +
              // Third arrow
              `L ${polarToCartesian(
                clockRadius - minorTickSize / 2,
                (-minorTickSize * 1.5) / (clockRadius * 2 * Math.PI)
              )}` +
              `L ${polarToCartesian(
                outerClockRadius,
                (-minorTickSize * 2.0) / (clockRadius * 2 * Math.PI)
              )}` +
              `A ${outerClockRadius} ${outerClockRadius} 0 0 0 ` +
              polarToCartesian(
                outerClockRadius,
                (-minorTickSize * 1.0) / (clockRadius * 2 * Math.PI)
              ) +
              "Z"
            }
          />
        )}
        <path
          class="timeLeft"
          d={`
              M 0 ${-clockRadius}
              ${drawArc(clockRadius, timeLeft / this.totalTime)}
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
              (originalTime / this.totalTime - 1) * clockRadius * Math.PI
            }
          />
          <animate
            class="animation--end"
            {...endAnimationAttributes}
            attributeName="stroke"
            values="#ff6161;#ff6161;#ffcece"
          />
        </circle>
        <circle class="inner-negative" cx={0} cy={0} r={innerClockRadius}>
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
            fill="freeze"
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
      </svg>
    );
  },

  setTime: function() {
    model.setTime(parseInt(this.dataset.time));
  },

  setIntermediateTime: function() {
    if (clock.interactionsOn)
      model.setIntermediateTime(parseInt(this.dataset.time));
  },

  resetIntermediateTime: function() {
    clock.interactionsOn = true;
    model.resetIntermediateTime();
  }
};

const polarToCartesian = function(radius, angle) {
  const rad = angle * (2 * Math.PI);
  return {
    x: -radius * Math.sin(rad),
    y: -radius * Math.cos(rad),
    toString: function() {
      return this.x + " " + this.y;
    }
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
