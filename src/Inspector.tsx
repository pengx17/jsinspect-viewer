import React, { useEffect, useState } from 'react';
import { IJSInspectItem } from './type';
import { sortInspectItems } from './util';

export const Inspector: React.FunctionComponent<{
  onParsed?: (directory: string, content: IJSInspectItem[]) => void;
  onParsing?: (parsing: boolean) => void;
}> = ({ onParsed, onParsing }) => {
  const fileInputRef = React.createRef<HTMLInputElement>();

  interface IOpts {
    threshold: number;
    minInstances: number;
    path: string;
    ignore: string;
    identifiers: boolean;
    literals: boolean;
  }

  const [opts, setOpts] = useState<IOpts>({
    identifiers: false,
    ignore: '',
    literals: false,
    minInstances: 3,
    path: '',
    threshold: 100,
  });

  const [parsing, setParsing] = useState<boolean>(false);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    let newValue: boolean | string | null = '';
    if (event.target.type === 'file') {
      if (event.target.files && event.target.files[0].path) {
        newValue = event.target.files[0].path;
      }
    } else if (event.target.type === 'checkbox') {
      newValue = !opts[event.target.name];
    } else {
      newValue = event.target.value;
    }

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
          const items = JSON.parse(message);
          sortInspectItems(items);
          onParsed(opts.path, items);
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
          Select a folder:
          <input
            ref={fileInputRef}
            name="path"
            onChange={onInputChange}
            type="file"
          />
          <code>{opts.path}</code>
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
          <input name="ignore" value={opts.ignore} onChange={onInputChange} />
        </label>
      </div>

      <div>
        <label>
          Don't match identifiers
          <input
            name="identifiers"
            type="checkbox"
            checked={opts.identifiers}
            onChange={onInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Don't match literals
          <input
            name="literals"
            type="checkbox"
            checked={opts.literals}
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
