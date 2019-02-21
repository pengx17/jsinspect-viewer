import React from 'react';
import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = () => {
  return (
    <div className={styles.ripple}>
      <div />
      <div />
    </div>
  );
};
