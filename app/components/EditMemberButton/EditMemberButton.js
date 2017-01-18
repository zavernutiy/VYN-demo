import React from 'react';
import { Link } from 'react-router';
import styles from './EditMemberButton.scss';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const EditButton = (props) => {
    if (!props.value) {
        return null;
    }
    return (
        <button>
            <Link className={styles.edit} to={`/members/edit/${props.value}`}>Edit</Link>
        </button>
    );
};

export default EditButton;