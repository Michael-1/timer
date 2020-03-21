const m = require("mithril");
const ms = require("ms");
const { model, STATE } = require("./model");

import "./digital-clock.scss";

const input = {
  userInput: null,

  view: function() {
    let time =
      model.state === STATE.READY ? model.originalTime : model.timeLeft;
    const milliseconds = time % 1000;
    const seconds = ((time - milliseconds) / 1000) % 60;
    const minutes = (((time - milliseconds) / 1000 - seconds) / 60) % 60;
    const hours =
      (((time - milliseconds) / 1000 - seconds) / 60 - minutes) / 60;
    let text, ghost;
    if (input.userInput === null) {
      const textHours = hours ? hours : "";
      const textMinutes = time
        ? hours
          ? ":" + String(minutes).padStart(2, "0")
          : minutes
        : "";
      const textSeconds = time ? ":" + String(seconds).padStart(2, 0) : "";
      text = textHours + textMinutes + textSeconds;
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
          onsubmit={function(e) {
            e.preventDefault();
            if (model.intermediateOriginalTime) {
              model.originalTime = model.intermediateOriginalTime;
              input.userInput = null;
            }
            model.start();
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
            onkeyup={function(e) {
              e.stopPropagation();
            }}
            onkeydown={function(e) {
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

  setTime: function() {
    input.userInput = null;
    const milliseconds = parseInput(this.value.replace(/[\.\,\/]/g, ":"));
    if (!milliseconds) return;
    model.setTime(milliseconds);
  },

  setIntermediateTime: function() {
    input.userInput = this.value.replace(/[\.\,\/]/g, ":");
    const milliseconds = parseInput(input.userInput);
    if (!milliseconds) return;
    model.setIntermediateTime(milliseconds);
  }
};

function parseInput(input) {
  let result;
  try {
    result = ms(input);
  } catch (e) {}
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
