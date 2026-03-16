'use client';
import styles from './loader.module.scss';

export default function Loader() {
  return (
    <div className={styles.body}>
      <div className={styles.truck}>
        <div className={styles.base}></div>
        <div className={styles.container}></div>
        <div className={styles.cabin}>
          <div className={styles.handle}></div>
        </div>
        <div className={styles.wheel1}></div>
        <div className={styles.wheel2}></div>
      </div>
    </div>
  );
}