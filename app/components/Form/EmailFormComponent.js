import React from 'react';
import TextField from 'material-ui/TextField';
import styles from './Form.scss';

class Email extends React.Component {
    getEmails = () => {
        return this.props.email.map((email, index) => {
            return (
                <div key={index}>
                    <label className={styles.left}>Email</label>
                    <TextField
                        className={styles.right}
                        hintText="Email"
                        value={email}
                        onChange={this.props.emailChange.bind(this, index)} />
                </div>
            )
        });
    };
    render() {
        return (
            <div>
                {this.getEmails()}
            </div>
        );
    }
}

export default Email;