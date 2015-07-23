"use strict";

var deactivated = true;

function submitCode() {
  var code = document.forms[0].elements[0].value;
  var json = {"code":code};
  $.ajax({
    url: "/",
    type: "POST",
    data: json,
    success: function(data) {
      var jsonData = JSON.parse(data);
      analyzeData(jsonData);
      $("#codeForm")[0].reset();
    }
  });
}

function analyzeData(jsonObj) {
  if (jsonObj.status == 200) {
    hideWarning();
    if (jsonObj.state == "Activated") {
      activatedUpdates(jsonObj);
    } else if (jsonObj.state == "Deactivated") {
      deactivatedUpdates();
    } else { // Exploded
      explodedUpdates();
    }
  } else if (jsonObj.status == 401) {
    showInvalid();
    if (jsonObj.state == "Activated") {
      activatedUpdates(jsonObj);
    } else if (jsonObj.state == "Deactivated") {
      deactivatedUpdates();
    } else { // Exploded
      explodedUpdates();
      hideWarning();
    }
  } else { // 400 - not numerical format
    showInputWarning();
  }
}

function activatedUpdates(jsonObj) {
  deactivated = false;
  document.getElementById("bombState").innerHTML = "<span style=\"color:red\">Activated!</span>";
  document.getElementById("formLabel").innerHTML = "To deactivate, enter your deactivation code: ";
  if (jsonObj.attempts_remaining <= 0) {
    explodedUpdates();
  } else if (jsonObj.attempts_remaining < 3) {
    document.getElementById("AttemptsRemaining").innerHTML = "(" + jsonObj.attempts_remaining + " attempts remaining!)";
  }
  timer(jsonObj.timer_end);
}

function deactivatedUpdates() {
  deactivated = true;
  hideTimer();
  document.getElementById("bombState").innerHTML = "Deactivated";
  document.getElementById("formLabel").innerHTML = "To activate, enter your activation code: ";
  document.getElementById("AttemptsRemaining").innerHTML = "";
}

function explodedUpdates() {
  deactivated = true;
  hideTimer();
  document.getElementById("bombState").innerHTML = "!@#$%^&*!@#&$!";
  document.getElementById("formLabel").innerHTML = "To deactiv ent fjds as;dfasåß∂¬ƒåƒ∆åƒ…å¬˚∆å…ßˆƒ˙Ω©√∫˚∫´å: ";
  document.getElementById("AttemptsRemaining").innerHTML = "";
  disableButtons();
}

function updatePage() {
  $.ajax({
    url: "/status",
    type: "GET",
    success: function(data) {
      var jsonData = JSON.parse(data);
      analyzeData(jsonData);
    }
  });
}

function timer(timer_end) {
  updateTimer(getTimeString(getNumSecondsLeft(timer_end)));
  showTimer();
  var timer_handler = setInterval(function() {
    var numSecondsLeft = getNumSecondsLeft(timer_end);
    updateTimer(getTimeString(numSecondsLeft));

    if(deactivated) {
      clearInterval(timer_handler);
      updatePage();
    } else if (!deactivated && numSecondsLeft <= 0) {
      clearInterval(timer_handler);
      $.ajax({
        url: "/explode",
        type: "POST",
        success: function() {
          hideTimer();
          updatePage();
        }
      });
    }
  }, 500);
}

function getNumSecondsLeft(timer_end) {
  var now = Math.floor(new Date().getTime() / 1000);
  if (timer_end - now <= 0) {
    return 0;
  } else {
    return (timer_end - now);
  }
}

function getTimeString(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds - (mins * 60);
  var timeString = "0" + mins + ":";
  if (secs < 10) {
    timeString = timeString + "0" + secs;
  } else {
    timeString = timeString + secs;
  }
  return timeString;
}

function updateTimer(string) {
  document.getElementById("timer").innerHTML = "<center><span style=\"font-size:200pt\">" + string + "</span></center>";
}

function showTimer() {
  $("#timer").removeClass("hidden");
}

function showInvalid() {
  document.getElementById("Invalid").innerHTML = "<span style=\"color:red\">Invalid!</span>";
}

function hideWarning() {
  document.getElementById("Invalid").innerHTML = "";
}

function showInputWarning() {
  document.getElementById("Invalid").innerHTML = "<span style=\"color:red\">Only numeric input is allowed.</span>";
}

function hideTimer() {
  $("#timer").addClass("hidden");
}

function disableButtons() {
  document.getElementById("formButton").disabled = true;
}

window.onload = updatePage();
