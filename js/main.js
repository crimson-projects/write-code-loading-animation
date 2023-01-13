const pen = ["m 60.264343,28.128678 c 2.2627,2.413318 3.749992,3.809537 5.624988,5.714306 1.874996,1.904769 3.413845,3.722377 5.624988,5.714306 2.389714,-2.070571 4.580577,-4.163301 6.249986,-5.714306 2.07367,-3.162913 -1.496533,-5.793073 -3.593194,-7.94572 -2.236402,-2.334051 -5.869742,-5.734163 -8.192494,-3.840037 -1.430942,1.629571 -3.646617,3.881348 -5.714274,6.071451 z", "m 21.693,77.771712 c -0.06621,-3.979472 -0.07911,-6.087782 0,-11.25004 7.489822,-7.483686 26.601376,-26.21885 35.357065,-34.821553 5.714274,5.982164 0,0 5.714274,5.982164 5.714274,5.982164 0,0 5.714272,5.982164 -9.39546,9.407095 -27.870138,27.895453 -34.821351,34.821553 -4.986928,-0.216756 -8.058768,-0.306244 -11.96426,-0.714288 z"];
const code = ["m 45.89617,34.190119 c 7.894197,-0.0719 9.964869,-0.100706 20.581912,-0.378704 -0.115829,8.055761 -0.08105,12.07616 -0.126168,20.076835 2.511838,-0.08054 2.985415,-0.131713 5.555852,-0.25251 0.171321,-6.876206 0.464662,-18.786227 0.50495,-25.758959 -6.399438,0.09834 -19.892677,0.06643 -26.137769,0.126139 -0.152611,2.806065 -0.254888,4.112516 -0.378777,6.187199 z",
              "m 27.713503,72.070917 c 0.123889,-7.283277 0.26285,-18.460812 0.504948,-25.758958 5.555853,-0.252511 0,0 5.555853,-0.252511 -0.126169,20.076836 0,0 -0.126169,20.076836 20.581913,-0.378704 0,0 20.581913,-0.378704 -0.378777,6.187198 0,0 -0.378777,6.187198 -26.137768,0.126139 -18.811783,-0.04045 -26.137768,0.126139 z"];
const paths = Array.from(document.querySelectorAll('path'));
const svg = document.querySelector('svg');
paths.forEach((path, i) => {
  path.setAttribute('d', pen[i]);
});
let alternate = true;
let start = null;
const duration = 400;
const restart = 2000;
const easing = BezierEasing(0.4, 0.0, 0.2, 1);

const interpolate = (pct, from, to) => {
  return to * pct + from * (1 - pct);
}

function animate(inPct) {
  const pct = easing(inPct);
  const flatPen = pen.map(part => part.split(" ").map(p => p.length === 1 ? p : p.split(',').map(p2 => parseFloat(p2))));
  const flatCode = code.map(part => part.split(" ").map(p => p.length === 1 ? p : p.split(',').map(p2 => parseFloat(p2))));
  const intersection = flatPen.map((part, i) => part.map((p, j) => p.length === 1 ? p : p.map((r, k) => interpolate(pct, r, flatCode[i][j][k]))
                                                        ));
  const descs = intersection.map(part => part.reduce((a, p) => a + ' ' + (p.length === 1 ? p : p.join(','))));
  paths.forEach((path, i) => {
    path.setAttribute('d', descs[i]);
  })
  svg.style.transform = `rotate(${225 * pct}deg)`;
}

function step(timestamp) {
  if (!start) start = timestamp;
  const progress = (timestamp - start);
  let pct = progress / duration;
  if (pct > 1) pct = 1;
  animate(alternate ? pct : 1 - pct);
  if (progress < duration) {
    window.requestAnimationFrame(step);
  } else {
    alternate = !alternate;
    start = null;
  }
}

setInterval(() => {
  window.requestAnimationFrame(step);
}, restart);