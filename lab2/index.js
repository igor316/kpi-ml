const count = 60000;
const fs = require('fs');
const dataset = require(`./dataset-${count}.json`);

const numbers = Array
  .apply(null, { length: 10 })
  .map((_, i) => i)
  .reduce(
    (prev, curr) => Object.assign(
      prev, {
        [curr]: Array.apply(null, { length: 784 }).map(() => ({
          mathAvg: 0,
          dispersion: 100000000
        }))
      }),
  {});

dataset.forEach((line) =>
  line.pixels.forEach((p, i) =>
    numbers[line.label][i].mathAvg += 10 * p / count
  )
);

dataset.forEach((line) =>
  line.pixels.forEach((p, i) =>
    numbers[line.label][i].dispersion += 10 * Math.pow(p - numbers[line.label][i].mathAvg, 2) / count
  )
);

fs.writeFile(`classifier-${count}.json`, JSON.stringify(numbers));
