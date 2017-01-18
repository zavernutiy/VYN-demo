import React from 'react';
import { Link } from 'react-router';
import styles from './PaymentRequestInfoButton.scss';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const InfoButton = (props) => {
    if (!props.value) {
        return null;
    }
    return (
        <button>
            <Link className={styles.edit} to={`/paymentrequest/info/${props.value}`}>Info</Link>
        </button>
    );
};

export default InfoButton;