function createVariants(array) {
  if (array.length == 1) return [array];

  const result = [];

  for (let i = 0; i < array.length; i++) {
    for (let item of createVariants(array.filter((v, j) => j != i))) {
      result.push([array[i], ...item]);
    }
  }

  return result;
}
