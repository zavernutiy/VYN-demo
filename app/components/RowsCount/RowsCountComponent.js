import React from 'react';

/**
 * RowsCount is stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const RowsCount = (props) => {
    const count = props.count ? props.count : 0;
    return (
        <div>
            <h4>Rows count: {count}</h4>
        </div>
    );
};

export default RowsCount;