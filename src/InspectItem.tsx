import React, { useState } from 'react';
import { FileContentMixer } from './FileContentMixer';
import { IJSInspectInstance, IJSInspectItem } from './type';
import { getLines, getMax } from './util';

import styles from './InspectItem.module.css';

const FilePath: React.FunctionComponent<{ instance: IJSInspectInstance }> = ({
  instance,
}) => {
  const fragments = instance.path.split('/');
  return (
    <div className={styles.filePath}>
      {fragments.map((fragment, index) =>
        index !== fragments.length - 1 ? (
          fragment + '/'
        ) : (
          <span className={styles.filePathName} key={index}>
            {fragment}
          </span>
        )
      )}
      : {JSON.stringify(instance.lines)} (lines: {getLines(instance)}, chars:{' '}
      {instance.code.length})
    </div>
  );
};

export const InspectItem: React.FunctionComponent<{ item: IJSInspectItem }> = ({
  item,
}) => {
  const FileListItem: React.FunctionComponent<{
    instance: IJSInspectInstance;
  }> = ({ instance }) => {
    return (
      <li>
        <FilePath instance={instance} />
      </li>
    );
  };

  const [showingCode, setShowingCode] = useState(false);
  const onSetShowingCode = () => {
    setShowingCode(!showingCode);
  };

  return (
    <fieldset className={styles.container}>
      <legend className={styles.sticky}>
        Instances: {item.instances.length}, Duplicate lines:{' '}
        {getMax(item.instances)}
      </legend>
      <ul>
        {item.instances.map((instance, i) => (
          <FileListItem key={instance.path + i} instance={instance} />
        ))}
      </ul>

      <fieldset>
        <legend>
          Mixed code. Show:{' '}
          <input
            type="checkbox"
            checked={showingCode}
            onChange={onSetShowingCode}
          />
        </legend>
        {showingCode && (
          <FileContentMixer codes={item.instances.map(ins => ins.code)} />
        )}
      </fieldset>
    </fieldset>
  );
};
