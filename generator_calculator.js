function calculatePercent(basePercent, upgradePercent) {
  return basePercent * (1 + upgradePercent);
}

function calculatePercentOfUpgrade(upgrade) {
  let upgradePercent = 0;

  if (upgrade.externalUpgrades)
    upgradePercent = upgrade.externalUpgrades.reduce(
      (partialSum, upgrade) => partialSum + calculatePercentOfUpgrade(upgrade),
      0
    );

  return calculatePercent(upgrade.upgradePercent, upgradePercent);
}

function calculatePercentOfUpgradePercents(upgradePercents, index = 0) {
  if (index >= upgradePercents.length) return 0;

  return calculatePercent(
    upgradePercents[index],
    calculatePercentOfUpgradePercents(upgradePercents, ++index)
  );
}

function convertUpgradePercentsToUpgrade(upgradePercents, index = 0) {
  const upgrade = {
    upgradePercent: upgradePercents[index],
  };

  if (index + 1 < upgradePercents.length)
    upgrade.externalUpgrades = [
      convertUpgradePercentsToUpgrade(upgradePercents, ++index),
    ];

  return upgrade;
}

function convertUpgradeToUpgradePercents(upgrade, addSelf = true) {
  const result = [];

  if (addSelf) result.push(upgrade.upgradePercent);

  if (upgrade.externalUpgrades)
    for (let externalUpgrade of upgrade.externalUpgrades) {
      result.push(...convertUpgradeToUpgradePercents(externalUpgrade, true));
    }

  return result;
}
