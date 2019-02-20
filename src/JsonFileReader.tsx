import React from 'react';

export interface IJsonFileReaderProps {
  onFileContent?: (fileContent: any) => void;
}

export const JsonFileReader: React.FunctionComponent<IJsonFileReaderProps> = ({
  onFileContent,
}) => {
  const inputRef = React.createRef<HTMLInputElement>();
  const onInput = () => {
    if (
      inputRef.current === null ||
      !inputRef.current.files ||
      inputRef.current.files.length === 0
    ) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      const json = JSON.parse(reader.result as string);
      if (onFileContent) {
        onFileContent(json);
      }
    };
    reader.readAsText(inputRef.current.files[0]);
  };

  return (
    <div>
      <input ref={inputRef} type="file" onInput={onInput} accept=".json" />
    </div>
  );
};
