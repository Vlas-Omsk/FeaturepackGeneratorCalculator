const upgradePercentsElement = document.getElementById("upgrade_percents");
const baseOutputElement = document.getElementById("base_output");
const baseUpgradePercentElement = document.getElementById(
  "base_upgrade_percent"
);
const variantsElement = document.getElementById("variants");

const upgradePercentTemplate = document.getElementById(
  "upgrade_percent_template"
);

let upgradePercentElements = [];

let counter = 0;

function addUpgradePercentElement() {
  const template = upgradePercentTemplate.content.cloneNode(true);
  const upgradePercentElement = template.firstElementChild;
  const labelElement = template.querySelector("label");
  const inputElement = template.querySelector("input");
  const buttonElement = template.querySelector("button");

  const id = ++counter;

  labelElement.setAttribute("for", "percent" + id);
  inputElement.setAttribute("id", "percent" + id);

  buttonElement.addEventListener("click", () =>
    removeUpgradePercentElement(upgradePercentElement)
  );

  upgradePercentElements.push(upgradePercentElement);

  upgradePercentsElement.appendChild(upgradePercentElement);
}

function removeUpgradePercentElement(upgradePercentElement) {
  upgradePercentElements = upgradePercentElements.filter(
    (x) => x != upgradePercentElement
  );
  upgradePercentsElement.removeChild(upgradePercentElement);
}

function tryReadInputs() {
  let baseOutput = Number.parseInt(baseOutputElement.value);

  if (Number.isNaN(baseOutput))
    return {
      success: false,
      message: "Not a number",
      element: baseOutputElement,
    };

  let baseUpgradePercent = Number.parseFloat(baseUpgradePercentElement.value);

  if (Number.isNaN(baseUpgradePercent))
    return {
      success: false,
      message: "Not a number",
      element: baseUpgradePercentElement,
    };

  const upgradePercents = [];

  for (let upgradePercentElement of upgradePercentElements) {
    const input = upgradePercentElement.querySelector("input");
    const upgradePercent = Number.parseFloat(input.value);

    if (Number.isNaN(upgradePercent))
      return {
        success: false,
        message: "Not a number",
        element: input,
      };

    upgradePercents.push(upgradePercent / 100);
  }

  return {
    success: true,
    result: {
      baseOutput: baseOutput,
      baseUpgradePercent: baseUpgradePercent / 100,
      upgradePercents: upgradePercents,
    },
  };
}

function calculate() {
  baseOutputElement.classList.remove("invalid");
  baseUpgradePercentElement.classList.remove("invalid");

  for (let upgradePercentElement of upgradePercentElements) {
    const input = upgradePercentElement.querySelector("input");

    input.classList.remove("invalid");
  }

  const readInputsResult = tryReadInputs();

  if (readInputsResult.success == false) {
    readInputsResult.element.classList.add("invalid");
    return;
  }

  const variants = createVariants(readInputsResult.result.upgradePercents);

  let maxOutput = 0,
    maxVariant;

  const computedVariants = [];

  for (let variant of variants) {
    const output =
      readInputsResult.result.baseOutput *
      calculatePercent(
        readInputsResult.result.baseUpgradePercent,
        calculatePercentOfUpgradePercents(variant)
      );

    computedVariants.push({
      output,
      variant,
    });

    if (output > maxOutput) {
      maxOutput = output;
      maxVariant = variant;
    }
  }

  let message = "";

  for (let computedVariant of computedVariants) {
    if (maxVariant == computedVariant.variant) message += "<strong>";

    message += `[<br />  ${(
      readInputsResult.result.baseUpgradePercent * 100
    ).toFixed(2)}%,<br />`;

    for (let i = 0; i < computedVariant.variant.length; i++) {
      const item = computedVariant.variant[i];

      message += `  ${(item * 100).toFixed(2)}%`;

      if (i != computedVariant.variant.length - 1) message += ",<br />";
    }

    message += `<br />] = ${computedVariant.output.toFixed(2)} NE`;

    if (maxVariant == computedVariant.variant) message += "</strong>";

    message += "<br /><br />";
  }

  variantsElement.innerHTML = message;
}
