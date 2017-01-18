import React from 'react';
import styles from './ViewProfileButton.scss';

const ViewProfileButton = (props) => {
    if (!props.value) {
        return null;
    }
    return (
        <button className={styles.margin}>
            <a className={styles.view} href={`https://app.valueyournetwork.com/admin/open-user-from-new-bo/${props.value}`} target="_blank">View Profile</a>
        </button>
    );
};

export default ViewProfileButton;