import React from 'react';
import TextField from 'material-ui/TextField';
import styles from './Form.scss';

class Name extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <label className={styles.left}>First Name</label>
                    <TextField
                        hintText="First Name"
                        className={styles.right}
                        value={this.props.firstName}
                        onChange={this.props.firstNameChange} />
                </div>
                <div>
                    <label className={styles.left}>Last Name</label>
                    <TextField
                        hintText="Last Name"
                        className={styles.right}
                        value={this.props.lastName}
                        onChange={this.props.lastNameChange} />
                </div>
            </div>
        );
    }
}

export default Name;