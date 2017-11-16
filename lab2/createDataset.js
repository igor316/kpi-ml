const fs = require('fs');
const readline = require('readline');

const fn = './mnist_train.csv';
const promise = Promise.resolve();
const count = 6000;

const readStream = fs.createReadStream(fn);
const lines = [];

const lineReader = require('readline').createInterface({
  input: readStream
});

lineReader.on('line', (line) => {
  lines.push(line);
});

readStream.on('end', function () {
  const res = [];
  const numbers = Array
    .apply(null, { length: 10 })
    .map((_, i) => i)
    .reduce((prev, curr) => Object.assign(prev, { [curr]: 0 }), {});

  lines.forEach(line => {
    if (numbers[line[0]] < count) {
      res.push(line);
      numbers[line[0]]++;
    }
  });

  fs.writeFile(
    `dataset-${count}0.json`,
    JSON.stringify(
      res.map(
        line => ({
          label: line[0],
          pixels: line.split(',').slice(1).map(num => parseInt(num, 10)),
          length: line.split(',').slice(1).length
        })
      )
    )
  );
});
