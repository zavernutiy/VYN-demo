import React from 'react';
import CreateUser from '../CreateEditUser/CreateEditUserComponent';

class CreateMember extends React.Component {
    // To set variable in the relay container use following line
    // this.props.relay.setVariables({varName: varValue});

    render() {
        return (
            <div>
                <h1>Create Recruit</h1>
                <CreateUser store={this.props.store} isRecruit={true} />
            </div>
        );
    }
}

export default CreateMember;