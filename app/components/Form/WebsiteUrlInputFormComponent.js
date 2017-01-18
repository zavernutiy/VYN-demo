import React from 'react';
import TextField from 'material-ui/TextField';
import styles from './Form.scss';

class Website extends React.Component {
    render() {
        return (
            <div>
                <label className={styles.left}>Website</label>
                <TextField
                    className={styles.right}
                    hintText="Website"
                    value={this.props.website}
                    onChange={this.props.websiteChange} />
            </div>
        );
    }
}

export default Website;