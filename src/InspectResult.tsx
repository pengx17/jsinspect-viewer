import React from 'react';
import { InspectItem } from './InspectItem';
import { IJSInspectItem } from './type';

import styles from './InspectResult.module.css';

export const InspectResult: React.FunctionComponent<{
  directory: string;
  items: IJSInspectItem[];
}> = ({ directory, items }) => {
  return (
    <fieldset className={styles.container}>
      <legend className={styles.sticky}>
        Results for <strong>{directory}</strong>
      </legend>
      {items.length > 0 &&
        items.map((item, i) => <InspectItem key={i} item={item} />)}
      {items.length === 0 && <h4>No duplicates found!</h4>}
    </fieldset>
  );
};
