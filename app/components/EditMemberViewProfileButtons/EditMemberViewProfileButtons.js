import React from 'react';
import EditMemberButton from '../EditMemberButton/EditMemberButton';
import ViewProfileButton from '../ViewProfileButton/ViewProfileButton';

const EditMemberViewProfileButtons = (props) => {
    if (!props.value) {
        return null;
    }
    return (
        <div>
            <EditMemberButton value={props.value}/>
            <ViewProfileButton value={props.dependentValues}/>
        </div>
    );
};

export default EditMemberViewProfileButtons;