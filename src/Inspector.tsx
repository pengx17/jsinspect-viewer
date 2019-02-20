import React, { useEffect, useState } from 'react';

export const Inspector: React.FunctionComponent<{
  onParsed?: (directory: string, content: any) => void;
  onParsing?: (parsing: boolean) => void;
}> = ({ onParsed, onParsing }) => {
  const fileInputRef = React.createRef<HTMLInputElement>();

  interface IOpts {
    threshold: number;
    minInstances: number;
    path: string;
    ignorePattern?: string;
  }

  const [opts, setOpts] = useState<IOpts>({
    minInstances: 3,
    path: '',
    threshold: 100,
  });

  const [parsing, setParsing] = useState<boolean>(false);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const newValue =
      event.target.type === 'file'
        ? event.target.files && event.target.files[0].path
        : event.target.value;
    setOpts({ ...opts, [event.target.name]: newValue });
  };

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (opts.path) {
      setParsing(true);
      if (onParsing) {
        onParsing(true);
      }
      ipcRenderer.send('parse', opts);
      ipcRenderer.once('parsed', (_: any, message: string) => {
        if (onParsed) {
          onParsed(opts.path, JSON.parse(message));
        }
        setParsing(false);
        if (onParsing) {
          onParsing(false);
        }
      });
    }
  };

  // Bind some more attributes to folder selector
  useEffect(() => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).directory = true;
      (fileInputRef.current as any).webkitdirectory = true;
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          Select a folder:{' '}
          <input
            ref={fileInputRef}
            name="path"
            onChange={onInputChange}
            type="file"
          />
        </label>
      </div>

      <div>
        <label>
          Min tokens:{' '}
          <input
            name="threshold"
            value={opts.threshold}
            onChange={onInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          Min instances:{' '}
          <input
            name="minInstances"
            value={opts.minInstances}
            onChange={onInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          Ignore pattern (default is 'node_modules'):{' '}
          <input
            name="ignorePattern"
            value={opts.ignorePattern}
            onChange={onInputChange}
          />
        </label>
      </div>

      <button style={{ fontSize: '24px' }} disabled={!opts.path || parsing}>
        Analyze!
      </button>
    </form>
  );
};
