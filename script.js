const display = document.getElementById("display");
const expression = document.getElementById("expression");
const keys = document.querySelectorAll(".key");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForNewValue = false;
let lastExpression = "";

function updateDisplay() {
  display.textContent = currentValue;
  expression.textContent = lastExpression || "Your calculation appears here";
}

function inputNumber(number) {
  if (number === "." && currentValue.includes(".")) return;

  if (waitingForNewValue) {
    currentValue = number === "." ? "0." : number;
    waitingForNewValue = false;
  } else if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  lastExpression = "";
  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (nextOperator === "%") {
    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
    return;
  }

  if (operator && !waitingForNewValue) {
    calculate();
  }

  previousValue = currentValue;
  operator = nextOperator;
  waitingForNewValue = true;
  lastExpression = `${previousValue} ${operator}`;
  updateDisplay();
}

function calculate() {
  if (previousValue === null || operator === null) return;

  const first = Number(previousValue);
  const second = Number(currentValue);
  let result;

  if (operator === "+") result = first + second;
  if (operator === "−") result = first - second;
  if (operator === "×") result = first * second;
  if (operator === "÷") {
    if (second === 0) {
      currentValue = "Cannot divide by 0";
      previousValue = null;
      operator = null;
      waitingForNewValue = true;
      lastExpression = "Try another calculation";
      updateDisplay();
      return;
    }
    result = first / second;
  }

  result = Number(result.toFixed(10));
  lastExpression = `${first} ${operator} ${second} =`;
  currentValue = String(result);
  previousValue = null;
  operator = null;
  waitingForNewValue = true;
  updateDisplay();
}

function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  waitingForNewValue = false;
  lastExpression = "";
  updateDisplay();
}

function backspace() {
  if (waitingForNewValue || currentValue === "Cannot divide by 0") return;

  currentValue = currentValue.length > 1
    ? currentValue.slice(0, -1)
    : "0";

  if (currentValue === "-") currentValue = "0";
  updateDisplay();
}

function pressVisual(keyValue) {
  const button = [...keys].find((key) => {
    return key.dataset.number === keyValue ||
      key.dataset.operator === keyValue ||
      (key.dataset.action === "equals" && keyValue === "=");
  });

  if (!button) return;

  button.classList.add("pressed");
  setTimeout(() => button.classList.remove("pressed"), 120);
}

keys.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.number !== undefined) {
      inputNumber(button.dataset.number);
      return;
    }

    if (button.dataset.operator !== undefined) {
      chooseOperator(button.dataset.operator);
      return;
    }

    if (button.dataset.action === "equals") calculate();
    if (button.dataset.action === "clear") clearCalculator();
    if (button.dataset.action === "backspace") backspace();
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    inputNumber(key);
    pressVisual(key);
    return;
  }

  const operatorMap = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
    "%": "%"
  };

  if (operatorMap[key]) {
    chooseOperator(operatorMap[key]);
    pressVisual(operatorMap[key]);
    event.preventDefault();
    return;
  }

  if (key === "Enter" || key === "=") {
    calculate();
    pressVisual("=");
  }

  if (key === "Escape") {
    clearCalculator();
    pressVisual("AC");
  }

  if (key === "Backspace") {
    backspace();
    pressVisual("⌫");
  }
});

updateDisplay();
