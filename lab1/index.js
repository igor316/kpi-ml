const dataset = require('./dataset.json');
const fieldNames = Object.keys(dataset[0]);


const clusterCount = 2;
const fieldNumbers = [/*0,*/ 1, 2];
const availableFields = fieldNames.filter((_, index) => fieldNumbers.indexOf(index) >= 0);
const INF = 1000;

const normalizeData = (arr) => {
  const calcExtremums = () => fieldNames.reduce((obj, curr) => ({
    ...obj,
    [curr]: {
      min: arr.reduce((prev, point) => Math.min(point[curr], prev), INF),
      max: arr.reduce((prev, point) => Math.max(point[curr], prev), -INF),
    },
  }), {})
  const extremums = calcExtremums();

  fieldNames.forEach(fn => {
    const delta = extremums[fn].max - extremums[fn].min;
    arr.forEach((point, index) => {
      point[fn] = (point[fn] - extremums[fn].min) /delta;
      point.id = index;
    });
  });

  console.log('extremums :', calcExtremums());
}

const generateEmptyClusters = () => {
  return Array.apply(null, { length: clusterCount }).map(() => ({
    center: null,
    points: [],
  }));
};

const generateStaticClusters = (dataset) => {
  const clusters = generateEmptyClusters();

  const clusterSize = Math.ceil(dataset.length / clusterCount)
  const asd = [0, 0, 0, 0];
  dataset.forEach((point, index) => {
    asd[Math.trunc(index / clusterSize)]++;
    clusters[Math.trunc(index / clusterSize)].points.push(point);
  });
  console.log('distribution :', asd);
  return clusters;
};

const generateRandomClusters = (dataset) => {
  const clusters = generateEmptyClusters();

  const asd = [0, 0, 0, 0];
  dataset.forEach((point, index) => {
    const clusterNum = Math.trunc(Math.random() * clusterCount);
    asd[clusterNum]++;
    clusters[clusterNum].points.push(point);
  });
  console.log('distribution :', asd);
  return clusters;
};

const calculateCenter = (cluster) => {
  cluster.center = fieldNames.reduce((obj, curr) => ({
    ...obj,
    [curr]: cluster.points.reduce((p, c) => p + c[curr], 0) / cluster.points.length,
  }), {});

  return cluster.center;
};

const calculateDistance = (pointA, pointB) => {
  return Math.sqrt(availableFields.reduce((p, c) => p + Math.pow(pointA[c] - pointB[c], 2), 0));
};

const sort = (clusters) => {
  let changed = false;
  const toInsert = Array.apply(null, { length: clusterCount }).map(() => []);

  clusters.forEach((cluster, clusterIndex) => {
    cluster.points.slice().forEach((point, pointIndex) => {
      const minDistClusterIndex =
        clusters.map((_, i) => i)
        .reduce((p, c) =>
          calculateDistance(clusters[p].center, point) > calculateDistance(clusters[c].center, point) ? c : p,
          0
        );

      if (clusterIndex !== minDistClusterIndex) {
        changed = true;
        toInsert[minDistClusterIndex].push(...cluster.points.splice(pointIndex, 1));
      }
    });
  });

  toInsert.forEach((arr, index) => {
    clusters[index].points.push(...arr);
  });

  return changed;
};

normalizeData(dataset);

const randomClusters = generateStaticClusters(dataset); // generateRandomClusters

const initialCenter = randomClusters.map(calculateCenter);
console.log('initial centers: ', initialCenter);

let iterations = 0;
while (sort(randomClusters)) {
  randomClusters.map(calculateCenter)
  iterations++;
}

console.log(randomClusters.map(c => c.points.length), randomClusters.map(c => c.points.length).sort((a, b) => a - b), iterations);

let countt = -1;
const points = randomClusters.reduce((p, cluster) => {
  countt++;
  return [
    ...p,
    ...cluster.points.map(p => {
      p.cluster = countt;
      return p;
    }),
  ];
}, []);

console.log(...points.sort((a, b) => a.id - b.id).map(p => `${p.id}-${p.cluster}\n`));
