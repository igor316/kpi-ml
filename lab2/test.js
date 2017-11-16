const testdata = require('./test-10000.json');
const count = 60000;
const classifier = require(`./classifier-${count}.json`);
const MININT = -1000;

let correct = 0;
let norm = testdata.length;
let inifs = 0;
let zeros = 0;
let nans = 0;
let mins = 0;

const dd = x => Math.pow(x, 2);
const sqrt = x => Math.pow(x, 0.5);

const gauss = (mathAvg, dispersion, x) => Math.exp(-dd(x - mathAvg) / 2 / dispersion) / sqrt(2 * Math.PI * dispersion);

testdata.forEach(line => {
  const best = Object
    .keys(classifier)
    .map(key => {
      let index = 0;

      const res = line.pixels.reduce((result, p) => {
        const d = classifier[key][index++];
        const mathAvg = d.mathAvg;
        const dispersion = d.dispersion;
        // console.log(p, gauss(mathAvg, dispersion, p));
        return result + gauss(mathAvg, dispersion, p);
      }, Math.pow(10, 0) * count / 10);

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
  if (line.label === best.key) {
    correct++;
  }

  if (best.probability === 0 || best.probability === NaN || best.probability === Infinity || best.probability === -1000) {
    switch (best.probability) {
      case 0:
        zeros++;
        break;
      case NaN:
        nans++;
        break;
      case Infinity:
        inifs++;
        break;
      case -1000:
        mins++;
        break;
      default:
    }
    norm--;
  }
});

console.log('mins: ', mins / testdata.length);
console.log('zeros: ', zeros / testdata.length);
console.log('nans: ', nans / testdata.length);
console.log('inifs: ', inifs / testdata.length);
console.log(correct / testdata.length, norm / testdata.length);
