import React from 'react';
import Highlight from 'react-highlight';

import styles from './FileContentMixer.module.css';

export const FileContentMixer: React.FunctionComponent<{ codes: string[] }> = ({
  codes,
}) => {
  const minMax = codes.reduce(
    (mm, code) => {
      const lines = code.split('\n').length;
      const min = Math.min(mm.min, lines);
      const max = Math.max(mm.max, lines);
      return { min, max };
    },
    {
      max: 0,
      min: Number.MAX_VALUE,
    }
  );
  return (
    <div
      className={styles.wrapper}
      style={{ height: (minMax.max + 2) * 1.2 + 'em' }}
    >
      {codes.map((code, i) => (
        <div
          style={{ opacity: 1 / codes.length }}
          className={styles.codeWrapper}
          key={i}
        >
          <Highlight className="javascript">{code}</Highlight>
        </div>
      ))}
    </div>
  );
};
