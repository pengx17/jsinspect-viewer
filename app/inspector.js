const { Inspector, reporters } = require('jsinspect');
const stream = require('stream');
const filepaths = require('filepaths');

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
  });

  let content = '';
  new reporters.json(inspector, {
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
