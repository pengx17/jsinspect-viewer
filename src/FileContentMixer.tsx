import React from 'react';
import Highlight from 'react-highlight';

import styles from './FileContentMixer.module.css';

function getHeight(codes: string[]) {
  return codes.reduce(
    (max, code) => Math.max(max, code.split(/\r?\n/).length),
    0
  );
}

// Generate a magnitude 2d map. Width is 120, height is auto.
function calcMagnitudeMap(codes: string[]): number[][] {
  const width = 120;
  const height = getHeight(codes);

  const codeMaps = codes.map(code => {
    const codeLines = Array.from(
      code.split(/\r?\n/).map(line => line.padEnd(width, ' '))
    );

    while (codeLines.length < height) {
      codeLines.push(''.padEnd(width, ' '));
    }

    return codeLines;
  });

  const rows: number[][] = [];

  function getMagnitude(y: number, x: number) {
    const chars = codeMaps.map(codeMap => codeMap[y][x]);
    const uniq = Array.from(new Set(chars));
    const mag = uniq.length;
    // console.log(x, y, chars, uniq, mag);
    return mag;
  }

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(getMagnitude(y, x));
    }

    rows.push(row);
  }

  return rows;
}

export const FileContentHeatmap: React.FunctionComponent<{
  codes: string[];
}> = ({ codes }) => {
  const heatmap = calcMagnitudeMap(codes);
  return (
    <pre>
      <code className="hljs">
        {heatmap.map((row, y) => (
          <span key={y}>
            {row.map((mag, x) => (
              <span
                style={{ opacity: ((mag - 1) / codes.length) * 0.8 }}
                key={x}
                className={styles.heatmapCell}
              >
                {' '}
              </span>
            ))}
            <br />
          </span>
        ))}
      </code>
    </pre>
  );
};

export const FileContentMixer: React.FunctionComponent<{ codes: string[] }> = ({
  codes,
}) => {
  const height = getHeight(codes);
  return (
    <div
      className={styles.wrapper}
      style={{ height: (height + 2) * 14 + 'px' }}
    >
      {codes.map((code, i) => (
        <div
          style={{ opacity: 1 / codes.length + 0.1 }}
          className={styles.codeWrapper}
          key={i}
        >
          <Highlight className="javascript">{code}</Highlight>
        </div>
      ))}
      <div className={styles.codeWrapper}>
        <FileContentHeatmap codes={codes} />
      </div>
    </div>
  );
};
