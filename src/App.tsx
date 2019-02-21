import React, { useState } from 'react';
import { Inspector } from './Inspector';
import { InspectResult } from './InspectResult';
import { IJSInspectItem } from './type';

import styles from './App.module.css';
import { LoadingSpinner } from './LoadingSpinner';

const App: React.FunctionComponent = () => {
  const [directory, setDir] = useState('');
  const [result, setResult] = useState<IJSInspectItem[]>([]);

  const onParsed = (ndir: string, content: any) => {
    setDir(ndir);
    setResult(content);
  };

  const [parsing, setParsing] = useState(false);

  return (
    <div>
      <Inspector onParsed={onParsed} onParsing={setParsing} />
      {parsing && (
        <div className={styles.loadingMask}>
          <LoadingSpinner />
        </div>
      )}
      {directory && result && (
        <InspectResult directory={directory} items={result} />
      )}
    </div>
  );
};

export default App;
