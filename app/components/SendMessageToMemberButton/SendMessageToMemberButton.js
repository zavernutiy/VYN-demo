import React from 'react';
import { Link } from 'react-router';
import styles from './SendMessageToMemberButton.scss';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const SendMessageToMemberButton = (props) => {
    if (!props.value) {
        return null;
    }
    return (
        <button>
            <a className={styles.edit} target="_blank" href={props.value}>contact</a>
        </button>
    );
};

export default SendMessageToMemberButton;