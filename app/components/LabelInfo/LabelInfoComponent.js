import React from 'react';
import styles from './LabelInfo.scss';

const LabelInfo = (props) => {
    return (
        <div className={styles.marginBottom}>
            <span className={styles.left}><strong>{props.label}</strong></span>
            <span className={styles.right}>{props.info}</span>
        </div>
    );
};

export default LabelInfo;