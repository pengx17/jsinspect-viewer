const Inspector = require('./lib/inspector');
const JSONReporter = require('./lib/reporters/json');
const stream = require('stream');
const filepaths = require('filepaths');
const { relative } = require('path');

const defaultOptions = {
  path: '.',
  threshold: 30,
  minInstances: 2,
};

function runJSInspector(opts = defaultOptions) {
  let paths = [];
  const extensions = ['.js', '.jsx'];
  const ignorePatterns = ['node_modules', 'bower_components'];
  if (opts.ignore) {
    ignorePatterns.push(opts.ignore);
  }

  paths = filepaths.getSync(opts.path, {
    ext: extensions,
    ignore: ignorePatterns,
  });

  if (opts.includePattern) {
    const reg = new RegExp(opts.includePattern);
    paths = paths.filter(path => reg.test(path));
  }

  const inspector = new Inspector(paths, {
    threshold: +opts.threshold,
    minInstances: +opts.minInstances,
    identifiers: opts.identifiers,
    literals: opts.literals,
  });

  let content = '';

  // By default it uses process.cwd()
  JSONReporter.prototype._getRelativePath = function(filePath) {
    if (filePath.charAt(0) === '/') {
      filePath = relative(opts.path, filePath);
    }
    return filePath;
  };

  new JSONReporter(inspector, {
    truncate: 0,
    writableStream: new stream.Writable({
      objectMode: true,
      write: (data, _, done) => {
        content += data;
        done();
      },
    }),
  });

  console.log('Parsing for ' + opts.path);
  inspector.run();
  console.log('Done!');
  return JSON.parse(content);
}

process.on('message', opts => {
  try {
    const content = runJSInspector(opts);
    process.send({ content: content });
  } catch (error) {
    process.send({
      error: {
        message: error.message,
      },
    });
  }
});
