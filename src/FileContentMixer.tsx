import React from 'react';
import Highlight from 'react-highlight';

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
      style={{
        fontSize: '12px',
        height: (minMax.max + 2) * 1.2 + 'em',
        position: 'relative',
      }}
    >
      {codes.map((code, i) => (
        <div
          style={{
            left: '0',
            opacity: 0.2,
            position: 'absolute',
            top: '0',
            width: '100%',
          }}
          key={i}
        >
          <Highlight>{code}</Highlight>
        </div>
      ))}
    </div>
  );
};
