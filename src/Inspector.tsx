import React, { useEffect, useState } from 'react';
import { IJSInspectItem } from './type';
import { sortInspectItems } from './util';

import styles from './Inspector.module.css';

interface IOpts {
  threshold: number;
  minInstances: number;
  path: string;
  ignore: string;
  identifiers: boolean;
  literals: boolean;
}

const DEFAULT_OPTS: IOpts = {
  identifiers: false,
  ignore: '',
  literals: false,
  minInstances: 2,
  path: '',
  threshold: 30,
};

const JSINSPECT_OPTS = 'JSINSPECT_OPTS';

export const Inspector: React.FunctionComponent<{
  onParsed?: (directory: string, content: IJSInspectItem[]) => void;
  onParsing?: (parsing: boolean) => void;
}> = ({ onParsed, onParsing }) => {
  const fileInputRef = React.createRef<HTMLInputElement>();

  const dopts = localStorage.getItem(JSINSPECT_OPTS);

  const [opts, setOpts] = useState<IOpts>(
    dopts ? JSON.parse(dopts) : DEFAULT_OPTS
  );

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

  const onSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    localStorage.setItem(JSINSPECT_OPTS, JSON.stringify(opts));
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

    if (opts.path) {
      onSubmit();
    }
  }, []);

  return (
    <fieldset>
      <legend>JSInspect options</legend>
      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          Choose a folder:
          <input
            type="text"
            name="path"
            value={opts.path}
            onChange={onInputChange}
          />
          <input
            ref={fileInputRef}
            name="path"
            onChange={onInputChange}
            type="file"
          />
        </label>

        <label>
          Min tokens:
          <input
            type="text"
            name="threshold"
            value={opts.threshold}
            onChange={onInputChange}
          />
        </label>

        <label>
          Min instances:
          <input
            type="text"
            name="minInstances"
            value={opts.minInstances}
            onChange={onInputChange}
          />
        </label>

        <label>
          Ignore regex pattern (default is 'node_modules'):
          <input
            name="ignore"
            type="text"
            value={opts.ignore}
            onChange={onInputChange}
          />
        </label>

        <label>
          Don't match identifiers:
          <input
            name="identifiers"
            type="checkbox"
            checked={opts.identifiers}
            onChange={onInputChange}
          />
        </label>
        <label>
          Don't match literals:
          <input
            name="literals"
            type="checkbox"
            checked={opts.literals}
            onChange={onInputChange}
          />
        </label>

        <button
          className={styles.analyzeButton}
          disabled={!opts.path || parsing}
        >
          Analyze!
        </button>
      </form>
    </fieldset>
  );
};
