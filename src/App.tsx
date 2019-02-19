import React, { useState } from 'react';
import Highlight from 'react-highlight';

import defaultDup from './dup.json';

interface JSInspectInstance {
  lines: number[];
  code: string;
  path: string;
}

interface JSInspectItem {
  id: string;
  instances: JSInspectInstance[];
}

const FilePath: React.FunctionComponent<{ instance: JSInspectInstance }> = ({
  instance,
}) => {
  const fragments = instance.path.split('/');
  return (
    <div style={{ color: '#666', fontFamily: 'monospace' }}>
      {fragments.map((fragment, index) =>
        index !== fragments.length - 1 ? (
          fragment + '/'
        ) : (
          <span style={{ color: '#000', fontWeight: 'bold' }}>{fragment}</span>
        )
      )}
      : {JSON.stringify(instance.lines)},{' '}
      {instance.lines[1] - instance.lines[0]}
    </div>
  );
};

interface JsonFileReaderProps {
  onFileContent?: (fileContent: any) => void;
}

const JsonFileReader: React.FunctionComponent<JsonFileReaderProps> = ({
  onFileContent,
}) => {
  const inputRef = React.createRef<HTMLInputElement>();
  const onInput = () => {
    if (
      inputRef.current === null ||
      !inputRef.current.files ||
      inputRef.current.files.length === 0
    ) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      const json = JSON.parse(reader.result as string);
      console.log(json);
      onFileContent && onFileContent(json);
    };
    reader.readAsText(inputRef.current.files[0]);
  };

  return (
    <div>
      <input ref={inputRef} type="file" onInput={onInput} accept=".json" />
    </div>
  );
};

const App: React.FunctionComponent = () => {
  const [fileContent, setFileContent] = useState<JSInspectItem[]>(defaultDup);
  [...fileContent].sort((a, b) => a.instances.length - b.instances.length);

  const [collapseMapping, setCollapseMapping] = useState<{
    [i: string]: boolean;
  }>({});

  const onCatClick = (instance: JSInspectInstance) => {
    setCollapseMapping(prev => {
      return {
        ...prev,
        [instance.path]: !prev[instance.path],
      };
    });
  };
  return (
    <div>
      <JsonFileReader onFileContent={setFileContent} />
      {fileContent.map(item => (
        <div key={item.id}>
          <h4>Instances: {item.instances.length}</h4>
          <ul>
            {item.instances.map(instance => (
              <li key={instance.path} onClick={() => onCatClick(instance)}>
                <FilePath instance={instance} />
                {collapseMapping[instance.path] && (
                  <Highlight>{instance.code}</Highlight>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
