import React, { useEffect, useState } from 'react';
import styles from './Inspector.module.css';
import { InspectorOptsSelect } from './InspectorOptsSelect';
import { IInspectOpts, IJSInspectItem } from './type';
import { sortInspectItems } from './util';

const DEFAULT_OPTS: IInspectOpts = {
  identifiers: false,
  ignore: '',
  includePattern: '',
  literals: false,
  minInstances: 2,
  path: '',
  threshold: 30,
};

const JSINSPECT_OPTS_LIST = 'JSINSPECT_OPTS_LIST';
const MAX_OPTION_LIST = 15;

const useStoredOptList: () => [
  IInspectOpts[],
  React.Dispatch<IInspectOpts[]>
] = () => {
  const storedOptList = localStorage.getItem(JSINSPECT_OPTS_LIST);

  const [optsList, setOptList] = useState<IInspectOpts[]>(
    storedOptList ? JSON.parse(storedOptList) : []
  );

  return [
    optsList,
    (newOpts: IInspectOpts[]) => {
      setOptList(newOpts);
      localStorage.setItem(JSINSPECT_OPTS_LIST, JSON.stringify(newOpts));
    },
  ];
};

export const Inspector: React.FunctionComponent<{
  onParsed: (directory: string, content: IJSInspectItem[]) => void;
  onParsing: (parsing: boolean) => void;
}> = ({ onParsed, onParsing }) => {
  const fileInputRef = React.createRef<HTMLInputElement>();

  const [optsList, setOptList] = useStoredOptList();

  const [opts, setOpts] = useState<IInspectOpts>(DEFAULT_OPTS);
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

  const onSubmit: React.ChangeEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    e.stopPropagation();

    let newOptionList = [
      ...optsList.filter(option => option.path !== opts.path),
      opts,
    ];

    if (newOptionList.length > MAX_OPTION_LIST) {
      newOptionList = newOptionList.slice(
        newOptionList.length - MAX_OPTION_LIST
      );
    }

    setOptList(newOptionList);
    if (opts.path) {
      setParsing(true);
      if (onParsing) {
        onParsing(true);
      }
      if ($backend) {
        $backend.ipcRenderer.send('parse', opts);
        $backend.ipcRenderer.once(
          'parsed',
          (_: any, resp: IJSInspectItem[]) => {
            sortInspectItems(resp);
            onParsed(opts.path, resp);
            setParsing(false);
            onParsing(false);
          }
        );

        $backend.ipcRenderer.once('parseerror', (_: any, { message }) => {
          alert(message);
          setParsing(false);
          onParsing(false);
        });
      }
    }
  };

  // Bind some more attributes to folder selector
  useEffect(() => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).directory = true;
      (fileInputRef.current as any).webkitdirectory = true;
    }
  }, []);

  return (
    <fieldset>
      <legend>
        JSInspect options
        {optsList && optsList.length > 0 && (
          <div style={{ marginLeft: '12px' }}>
            <InspectorOptsSelect
              path={opts.path}
              options={optsList}
              onSelected={setOpts}
            />
          </div>
        )}
      </legend>
      <form onSubmit={onSubmit} className={styles.form}>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            🗂Choose a folder
          </button>
          <input
            type="text"
            name="path"
            value={opts.path}
            onChange={onInputChange}
          />
          <input
            hidden={true}
            ref={fileInputRef}
            name="path"
            onChange={onInputChange}
            type="file"
          />
        </div>

        <label>
          Min tokens:
          <input
            type="number"
            name="threshold"
            value={opts.threshold}
            onChange={onInputChange}
          />
        </label>

        <label>
          Min instances:
          <input
            type="number"
            name="minInstances"
            value={opts.minInstances}
            onChange={onInputChange}
          />
        </label>

        <label>
          File path regex pattern (default is empty):
          <input
            name="includePattern"
            type="text"
            value={opts.includePattern || ''}
            onChange={onInputChange}
          />
        </label>

        <label>
          Ignore regex pattern (default is 'node_modules'):
          <input
            name="ignore"
            type="text"
            value={opts.ignore || ''}
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
