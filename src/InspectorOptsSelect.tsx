import React, { useCallback } from 'react';
import { IInspectOpts } from './type';

export const InspectorOptsSelect: React.FunctionComponent<{
  onSelected: (opts: IInspectOpts) => void;
  options: IInspectOpts[];
  path: string;
}> = ({ onSelected, options, path }) => {
  const onLocalSelected = useCallback((npath: string) => {
    const option = options.find(opt => opt.path === npath);
    if (option) {
      onSelected(option);
    }
  }, []);

  if (!path && options.length > 0) {
    onLocalSelected(options[options.length - 1].path);
  }

  const eventHandler: React.ReactEventHandler<HTMLSelectElement> = e =>
    onLocalSelected(e.currentTarget.value);

  return (
    <select value={path} onChange={eventHandler}>
      {options.length > 0 &&
        options.map((option, idx) => {
          return (
            <option value={option.path} key={option.path}>
              #{idx}: {option.path}
            </option>
          );
        })}
    </select>
  );
};
