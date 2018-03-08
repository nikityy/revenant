module.exports = {
  promisify(func) {
    return function (...args) {
      return new Promise((resolve, reject) => {
        const callback = (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }

        func.apply(this, [...args, callback]);
      });
    }
  }
}
