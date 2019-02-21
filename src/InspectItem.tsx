import React from 'react';
import { FileContentMixer } from './FileContentMixer';
import { IJSInspectInstance, IJSInspectItem } from './type';
import { getLines, getMax } from './util';

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
      : {JSON.stringify(instance.lines)} ({getLines(instance)})
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

  return (
    <div>
      <h4>
        Instances: {item.instances.length}, Duplicate length:{' '}
        {getMax(item.instances)}
      </h4>
      <ul>
        {item.instances.map((instance, i) => (
          <FileListItem key={instance.path + i} instance={instance} />
        ))}
      </ul>

      <h5>Mixed code: </h5>
      <pre style={{ border: '1px dashed', position: 'relative' }}>
        <FileContentMixer codes={item.instances.map(ins => ins.code)} />
      </pre>
    </div>
  );
};
