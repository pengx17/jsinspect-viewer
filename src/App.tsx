import React, { useState } from 'react';
import Highlight from 'react-highlight';

import defaultDup from './dup.json';
import { JsonFileReader } from './JsonFileReader';

interface IJSInspectInstance {
  lines: number[];
  code: string;
  path: string;
}

interface IJSInspectItem {
  id: string;
  instances: IJSInspectInstance[];
}

const FilePath: React.FunctionComponent<{ instance: IJSInspectInstance }> = ({
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

const App: React.FunctionComponent = () => {
  const [fileContent, setFileContent] = useState<IJSInspectItem[]>(defaultDup);
  [...fileContent].sort((a, b) => a.instances.length - b.instances.length);

  const [collapseMapping, setCollapseMapping] = useState<{
    [i: string]: boolean;
  }>({});

  const FileListItem: React.FunctionComponent<{
    instance: IJSInspectInstance;
  }> = ({ instance }) => {
    const onCatClick = () => {
      setCollapseMapping(prev => {
        return {
          ...prev,
          [instance.path]: !prev[instance.path],
        };
      });
    };

    return (
      <li key={instance.path} onClick={onCatClick}>
        <FilePath instance={instance} />
        {collapseMapping[instance.path] && (
          <Highlight>{instance.code}</Highlight>
        )}
      </li>
    );
  };
  return (
    <div>
      <JsonFileReader onFileContent={setFileContent} />
      {fileContent.map(item => (
        <div key={item.id}>
          <h4>Instances: {item.instances.length}</h4>
          <ul>
            {item.instances.map(instance => (
              <FileListItem instance={instance} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
