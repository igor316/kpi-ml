const testdata = require('./test-10000.json');
const count = 10000;
const classifier = require(`./classifier-${count}.json`);
const MININT = -999999;

let correct = 0;

const dd = x => Math.pow(x, 2);
const sqrt = x => Math.pow(x, 0.5);

// const gauss = (mathAvg, dispersion, x) => Math.exp(-dd(x - mathAvg) / 2 / dispersion) / sqrt(2 * Math.PI * dispersion);
console.log(Object
  .keys(classifier)
  .slice(1));
testdata.forEach(line => {
  const best = Object
    .keys(classifier)
    .slice(1)
    .map(key => {
      let index = 0;

      const res = line.pixels.reduce((result, p) => {
        const dI = classifier[key][index];
        const mathAvgI = dI.mathAvg;
        const dispersionI = dI.dispersion;

        const dFooting = classifier[0][index++];
        const mathAvgFooting = dFooting.mathAvg;
        const dispersionFooting = dFooting.dispersion;
        // console.log(p, gauss(mathAvg, dispersion, p));
        // return result + gauss(mathAvg, dispersion, p);

        return result +
          0.5 * Math.log(dispersionFooting / dispersionI) +
          dd(p - mathAvgFooting) / 2 / dispersionFooting -
          dd(p - mathAvgI) / 2 / dispersionI;
      }, 0);

      // console.log(res);

      return {
        key,
        probability: res,
      };
    })
    .reduce((max, curr) =>
      curr.probability > max.probability ? curr : max, {
        key: 'fake',
        probability: MININT
      });
  // console.log(best.probability);
  if (line.label === (best.probability > 0 ? best : { key: '0' }).key) {
    correct++;
  }
});

console.log(correct / testdata.length);
