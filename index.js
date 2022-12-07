const upgradePercentsElement = document.getElementById("upgrade_percents");
const baseOutputElement = document.getElementById("base_output");
const baseUpgradePercentElement = document.getElementById(
  "base_upgrade_percent"
);
const variantsElement = document.getElementById("variants");
const allVariantsElement = document.getElementById("all_variants");

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
  const removeElement = template.querySelector("button[data-id=remove]");
  const upElement = template.querySelector("button[data-id=up]");

  const id = ++counter;

  labelElement.setAttribute("for", "percent" + id);
  inputElement.setAttribute("id", "percent" + id);

  removeElement.addEventListener("click", () =>
    removeUpgradePercentElement(upgradePercentElement)
  );
  upElement.addEventListener("click", () =>
    upUpgradePercentElement(upgradePercentElement)
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

function upUpgradePercentElement(upgradePercentElement) {
  const index = upgradePercentElements.indexOf(upgradePercentElement);

  if (index == 0) return;

  const upUpgradePercentElement = upgradePercentElements[index - 1];

  const input = upgradePercentElement.querySelector("input");
  const upInput = upUpgradePercentElement.querySelector("input");

  [input.value, upInput.value] = [upInput.value, input.value];
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

    upgradePercents.push(upgradePercent);
  }

  return {
    success: true,
    result: {
      baseOutput: baseOutput,
      baseUpgradePercent: baseUpgradePercent,
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

  let maxOutput = 0,
    maxVariant;

  const computedVariants = [];
  let variants = [readInputsResult.result.upgradePercents.map((x) => x / 100)];

  if (allVariantsElement.checked) variants = createVariants(variants[0]);

  for (let variant of variants) {
    const output =
      readInputsResult.result.baseOutput *
      calculatePercent(
        readInputsResult.result.baseUpgradePercent / 100,
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

    message += `[<br />  ${readInputsResult.result.baseUpgradePercent.toFixed(
      2
    )}%,<br />`;

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

function sort() {
  const readInputsResult = tryReadInputs();

  if (readInputsResult.success == false) {
    readInputsResult.element.classList.add("invalid");
    return;
  }

  const upgradePercents = readInputsResult.result.upgradePercents.sort(
    (a, b) => a < b
  );

  for (let i = 0; i < upgradePercents.length; i++) {
    const upgradePercentElement = upgradePercentElements[i];
    const input = upgradePercentElement.querySelector("input");
    const upgradePercent = upgradePercents[i];

    input.value = upgradePercent;
  }
}
