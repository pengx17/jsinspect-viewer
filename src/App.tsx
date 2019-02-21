import React, { useState } from 'react';
import { InspectItem } from './InspectItem';
import { Inspector } from './Inspector';
import { IJSInspectItem } from './type';

const App: React.FunctionComponent = () => {
  const [directory, setDir] = useState('');
  const [fileContent, setFileContent] = useState<IJSInspectItem[]>([]);

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
        fileContent.map(item => <InspectItem key={item.id} item={item} />)}
      {directory && fileContent && fileContent.length === 0 && (
        <h4>Not duplicates found!</h4>
      )}
    </div>
  );
};

export default App;
