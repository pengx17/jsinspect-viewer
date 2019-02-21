const { Inspector, reporters } = require('jsinspect');
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
  try {
    paths = filepaths.getSync(opts.path, {
      ext: extensions,
      ignore: ignorePatterns,
    });
  } catch (e) {
    console.log(e.message);
    process.exit(4);
  }

  const inspector = new Inspector(paths, {
    threshold: +opts.threshold,
    minInstances: +opts.minInstances,
    identifiers: opts.identifiers,
    literals: opts.literals,
  });

  let content = '';

  // By default it uses process.cwd()
  reporters.json.prototype._getRelativePath = function(filePath) {
    if (filePath.charAt(0) === '/') {
      filePath = relative(opts.path, filePath);
    }
    return filePath;
  };

  new reporters.json(inspector, {
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
  return content;
}

process.on('message', opts => {
  const content = runJSInspector(opts);
  process.send(content);
});
