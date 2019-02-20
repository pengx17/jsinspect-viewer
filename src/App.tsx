import React, { useState } from 'react';
import { FileContentMixer } from './FileContentMixer';
import { Inspector } from './Inspector';

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
          <span key={index} style={{ color: '#000', fontWeight: 'bold' }}>
            {fragment}
          </span>
        )
      )}
      : {JSON.stringify(instance.lines)},{' '}
      {instance.lines[1] - instance.lines[0]}
    </div>
  );
};

const App: React.FunctionComponent = () => {
  const [directory, setDir] = useState('');
  const [fileContent, setFileContent] = useState<IJSInspectItem[]>([]);
  [...fileContent].sort((a, b) => a.instances.length - b.instances.length);

  const FileListItem: React.FunctionComponent<{
    instance: IJSInspectInstance;
  }> = ({ instance }) => {
    return (
      <li>
        <FilePath instance={instance} />
      </li>
    );
  };

  const onParsed = (ndir: string, content: any) => {
    setDir(ndir);
    setFileContent(content);
  };

  const [parsing, setParsing] = useState(false);

  return (
    <div>
      <Inspector onParsed={onParsed} onParsing={setParsing} />
      {parsing && <h2>Parsing ... please wait</h2>}
      {directory && <h3>JSInspect results for {directory}</h3>}
      {fileContent.length > 0 &&
        fileContent.map(item => (
          <div key={item.id}>
            <h4>Instances: {item.instances.length}</h4>
            <ul>
              {item.instances.map((instance, i) => (
                <FileListItem key={instance.path + i} instance={instance} />
              ))}
            </ul>

            <h5>Mixed code: </h5>
            <div style={{ border: '1px dashed', position: 'relative' }}>
              <FileContentMixer codes={item.instances.map(ins => ins.code)} />
            </div>
          </div>
        ))}

      {directory && fileContent && fileContent.length === 0 && (
        <h4>Not duplicates found!</h4>
      )}
    </div>
  );
};

export default App;
