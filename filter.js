function filter(data, settings) {
  let out = {};
  settings.forEach((v) => {
    if (data[v] !== undefined) {
      out[v] = data[v];
    }
  });
  return out;
}
module.exports = filter;
