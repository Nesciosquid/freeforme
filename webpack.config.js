var path = require('path');
var config = {
  entry: path.resolve(__dirname, 'src/app.js'),
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.join(__dirname, 'src')
    }]
  }
};

module.exports = config;
