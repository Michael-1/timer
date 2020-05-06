// eslint-disable-next-line no-unused-vars
import m from "mithril";
import ms from "ms";
import { model, STATE } from "./model";

import "./digital-clock.scss";

const input = {
  userInput: null,

  view: function () {
    let time =
      model.state === STATE.READY ? model.originalTime : model.timeLeft;
    let text, ghost;
    if (input.userInput === null) {
      const { text: txt, hours, minutes } = this.formatTime(time);
      text = txt;
      const ghostHours = hours ? "" : "0";
      const ghostMinutes = time
        ? hours
          ? " "
          : minutes >= 10
          ? ":"
          : ":0"
        : ":00";
      const ghostSeconds = time ? "" : ":00";
      ghost = ghostHours + ghostMinutes + ghostSeconds;
    } else {
      text = input.userInput;
      ghost = "";
      const inputAnalysis = new RegExp(/^(\d{0,2}:)?(\d{1,2}):\d{0,2}$/).exec(
        text
      );
      if (inputAnalysis) {
        if (inputAnalysis[1]) {
          if (inputAnalysis[1].length === 0) ghost += "0:";
          if (inputAnalysis[1].length === 1) ghost += "0";
        } else {
          ghost += "0:";
        }
        if (inputAnalysis[2]) {
          if (ghost && inputAnalysis[2].length === 1) ghost += "0";
        }
      }
    }
    if (time < 0) {
      text = "";
    }
    const textWidth = time < 10 * 60000 ? 4.4 : time < 60 * 60000 ? 5.3 : 6.8;

    return (
      <div id="digital-clock">
        <form
          onsubmit={function (e) {
            e.preventDefault();
            if (model.intermediateOriginalTime) {
              model.originalTime = model.intermediateOriginalTime;
            }
            if (model.intermediateDigitalOriginalTime) {
              model.originalTime = model.intermediateDigitalOriginalTime;
            }
            model.start();
            input.userInput = null;
          }}
          {...(model.state !== STATE.READY
            ? { style: `width:${textWidth}ch`, onclick: model.clickOnDisabled }
            : {})}
        >
          <input
            id="time-input"
            list="presets"
            value={text}
            oninput={input.setIntermediateTime}
            onblur={input.setTime}
            onkeyup={function (e) {
              e.stopPropagation();
            }}
            onkeydown={function (e) {
              e.stopPropagation();
            }}
            inputmode="decimal"
            disabled={model.state !== STATE.READY}
          />
          <div class="ghost">
            {ghost}
            <span class="invisible">{text}</span>
          </div>
          <datalist id="presets">
            <option value="5 min" />
            <option value="10 min" />
            <option value="15 min" />
            <option value="20 min" />
            <option value="30 min" />
            <option value="45 min" />
            <option value="1 hour" />
            <option value="90 min" />
            <option value="2 hours" />
          </datalist>
        </form>
      </div>
    );
  },

  formatTime: function (time) {
    const secondFractions = time / 1000 - Math.round(time / 1000);
    let rest = time - secondFractions * 1000;
    const seconds = (rest / 1000) % 60;
    rest -= seconds * 1000;
    const minutes = (rest / (1000 * 60)) % 60;
    rest -= minutes * (1000 * 60);
    const hours = rest / (1000 * 60 * 60);
    const textHours = hours ? hours.toFixed(0) : "";
    const textMinutes = time
      ? hours
        ? ":" + minutes.toFixed(0).padStart(2, "0")
        : minutes
      : "";
    const textSeconds = time ? ":" + seconds.toFixed(0).padStart(2, 0) : "";
    const text = textHours + textMinutes + textSeconds;
    return { text, hours, minutes, seconds };
  },

  setTime: function () {
    input.userInput = null;
    const milliseconds = parseInput(this.value.replace(/[.,/]/g, ":"));
    if (!milliseconds) return;
    model.setTime(milliseconds);
  },

  setIntermediateTime: function () {
    input.userInput = this.value.replace(/[.,/]/g, ":");
    const milliseconds = parseInput(input.userInput);
    if (!milliseconds) return;
    model.setIntermediateDigitalTime(milliseconds);
  },
};

function parseInput(input) {
  let result;
  try {
    result = ms(input);
  } catch (e) {
    return null;
  }
  if (result < 0) result = null;
  if (result < 1000) result *= 60000;
  if (result) return result;
  let regResult = /(\d+)\D(\d{1,2})\D(\d{1,2})/.exec(input);
  if (regResult)
    result =
      ((parseInt(regResult[1]) * 60 + parseInt(regResult[2])) * 60 +
        parseInt(regResult[3])) *
      1000;
  if (result) return result;
  regResult = /(\d+)\D(\d{1,2})/.exec(input);
  if (regResult)
    result = (parseInt(regResult[1]) * 60 + parseInt(regResult[2])) * 1000;
  if (result) return result;
  regResult = /\D(\d{1,2})/.exec(input);
  if (regResult) result = parseInt(regResult[1]) * 1000;
  return result;
}

export default input;
