import React, { createRef, useEffect, useState } from 'react';
import { InspectItem } from './InspectItem';
import { IJSInspectItem } from './type';

import styles from './InspectResult.module.css';

const IntersectionWrapper: React.FunctionComponent<{
  children: React.ReactNode;
  onVisible: (visible: boolean) => void;
}> = ({ children, onVisible }) => {
  const ref = createRef<HTMLDivElement>();
  useEffect(() => {
    const ob = new IntersectionObserver(entries => {
      entries.forEach(en => {
        onVisible(en.isIntersecting);
      });
    });

    if (ref.current) {
      ob.observe(ref.current);
    }

    return () => {
      onVisible(false);
      ob.disconnect();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};

export const InspectResult: React.FunctionComponent<{
  directory: string;
  items: IJSInspectItem[];
}> = ({ items }) => {
  const [visibles, setVisibles] = useState<number[]>([]);
  const onVisible = (i: number) => (visible: boolean) => {
    setVisibles(lvisibles => {
      lvisibles = lvisibles.filter(idx => idx !== i);
      if (visible) {
        lvisibles = [...lvisibles, i];
      }
      lvisibles.sort((a, b) => a - b);
      return lvisibles;
    });
  };
  return (
    <fieldset className={styles.container}>
      <legend className={styles.sticky}>
        Copy & Paste analysis #{visibles[0]} ~ #{visibles[visibles.length - 1]}
      </legend>
      {items.length > 0 &&
        items.map((item, i) => (
          <IntersectionWrapper key={i} onVisible={onVisible(i)}>
            <InspectItem item={item} />
          </IntersectionWrapper>
        ))}
      {items.length === 0 && (
        <div className={styles.noDuplicatesHint}>
          <pre>
            <code>No duplicates found! 😎😎😎</code>
          </pre>
        </div>
      )}
    </fieldset>
  );
};
