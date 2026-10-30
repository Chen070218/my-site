/* ============================================================
   machine.js — two small toys.

   1. The useless machine: switch on, an arm comes out after a
      moment and switches it off again.
   2. Bug squash: a bug moves between nine cells for 30 seconds;
      click it to score. Best score is kept in localStorage.

   Everything is progressive: the page is readable without JS, the
   buttons simply do nothing until this file runs.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. The useless machine ---------- */

  var machine = document.getElementById("machine");
  var machineSwitch = document.getElementById("machine-switch");
  var machineStatus = document.getElementById("machine-status");
  var machineOn = false;
  var machineBusy = false;
  var offCount = 0;

  function setMachineOff(message) {
    machineOn = false;
    machine.classList.remove("is-on");
    machineSwitch.setAttribute("aria-pressed", "false");
    machineSwitch.textContent = "Turn it on";
    machineStatus.textContent = message;
  }

  if (machine && machineSwitch && machineStatus) {
    machineSwitch.addEventListener("click", function () {
      if (machineBusy) return;

      if (!machineOn) {
        machineOn = true;
        machineBusy = true;
        machine.classList.add("is-on");
        machineSwitch.setAttribute("aria-pressed", "true");
        machineSwitch.textContent = "Turn it off";
        machineStatus.textContent = "On. The arm is on its way…";

        window.setTimeout(function () {
          offCount += 1;
          machineBusy = false;
          setMachineOff(
            "Off again. It switched itself off" +
              (offCount === 1 ? " — for the first time." : " — " + offCount + " times so far.")
          );
        }, 900);
      } else {
        // Clicking while it is on switches it off by hand; the machine does
        // not mind, but it is not the point of the exercise.
        offCount += 1;
        setMachineOff("You switched it off by hand. It looks almost disappointed.");
      }
    });
  }

  /* ---------- 2. Bug squash ---------- */

  var board = document.getElementById("game-board");
  var startButton = document.getElementById("game-start");
  var resetButton = document.getElementById("game-reset");
  if (!board || !startButton) return;

  var tiles = Array.prototype.slice.call(board.querySelectorAll(".game__tile"));
  var scoreEl = document.getElementById("game-score");
  var missesEl = document.getElementById("game-misses");
  var timeEl = document.getElementById("game-time");
  var bestEl = document.getElementById("game-best");
  var note = document.getElementById("game-note");

  var BEST_KEY = "fieldnotes-bug-best";
  var running = false;
  var score = 0;
  var misses = 0;
  var secondsLeft = 30;
  var bugIndex = -1;
  var countdownId = 0;
  var hopId = 0;

  function readBest() {
    try {
      return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch (error) {
      return 0;
    }
  }

  function writeBest(value) {
    try {
      window.localStorage.setItem(BEST_KEY, String(value));
    } catch (error) {
      /* Storage may be blocked; the game still works for this visit. */
    }
  }

  function showBest() {
    var best = readBest();
    bestEl.textContent = best > 0 ? String(best) : "—";
  }

  function clearBug() {
    tiles.forEach(function (tile) {
      tile.classList.remove("is-bug", "is-miss", "is-hit");
      tile.textContent = "·";
      tile.setAttribute("aria-label", "Empty tile");
    });
    bugIndex = -1;
  }

  function placeBug() {
    if (!running) return;
    clearBug();
    var next = bugIndex;
    while (next === bugIndex) {
      next = Math.floor(Math.random() * tiles.length);
    }
    bugIndex = next;
    var tile = tiles[bugIndex];
    tile.classList.add("is-bug");
    tile.textContent = "◆";
    tile.setAttribute("aria-label", "Bug — click it");
  }

  function updateStats() {
    scoreEl.textContent = String(score);
    missesEl.textContent = String(misses);
    timeEl.textContent = String(secondsLeft);
  }

  function endGame() {
    running = false;
    window.clearInterval(countdownId);
    window.clearInterval(hopId);
    clearBug();
    startButton.textContent = "Play again";
    var best = readBest();
    if (score > best) {
      best = score;
      writeBest(best);
      showBest();
      note.textContent = "Time. " + score + " caught — a new best score.";
    } else {
      note.textContent = "Time. " + score + " caught, " + misses + " missed. Best is still " + (best || "—") + ".";
    }
    board.setAttribute("aria-label", "Bug squash board, game over");
  }

  function tick() {
    secondsLeft -= 1;
    if (secondsLeft <= 0) {
      secondsLeft = 0;
      updateStats();
      endGame();
      return;
    }
    updateStats();
  }

  function startGame() {
    running = true;
    score = 0;
    misses = 0;
    secondsLeft = 30;
    bugIndex = -1;
    updateStats();
    showBest();
    startButton.textContent = "Restart";
    note.textContent = "Go — catch the bug.";
    board.setAttribute("aria-label", "Bug squash board, game running");
    placeBug();
    window.clearInterval(countdownId);
    window.clearInterval(hopId);
    countdownId = window.setInterval(tick, 1000);
    hopId = window.setInterval(placeBug, 900);
  }

  startButton.addEventListener("click", startGame);

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      writeBest(0);
      showBest();
      note.textContent = "Best score cleared.";
    });
  }

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      if (!running) {
        note.textContent = "Press start first.";
        return;
      }

      var index = tiles.indexOf(tile);
      if (index === bugIndex) {
        score += 1;
        tile.classList.add("is-hit");
        note.textContent = "Caught. Score " + score + ".";
        updateStats();
        window.setTimeout(function () {
          tile.classList.remove("is-hit");
        }, 180);
        placeBug();
      } else {
        misses += 1;
        tile.classList.add("is-miss");
        note.textContent = "Nothing there. Misses: " + misses + ".";
        updateStats();
        window.setTimeout(function () {
          tile.classList.remove("is-miss");
        }, 180);
      }
    });
  });

  showBest();
})();
