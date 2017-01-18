import React from 'react';

const LinkToMembers = (props) => {
    return (
        <a href={"/members/" + props.dependentValues} >{props.value}</a>
    );
};

export default LinkToMembers;