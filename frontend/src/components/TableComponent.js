import React from 'react';
import styles from './TableComponent.module.css';

const Table = () => {
    return (
        <div className={styles.box}>
            <video
                className={styles.videoPlayer}
                loading="lazy"
                alt=""
                src="/table.mp4"
                autoPlay
                loop
                muted
            />
        </div>
    );
};

export default Table;