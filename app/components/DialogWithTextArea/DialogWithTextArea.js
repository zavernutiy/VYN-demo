import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const DialogWithTextArea = (props) => {

    const onMessageChange = (event) => {
        props.messageChange(event.target.value);
    };

    const getActionButtons = () => {
        return [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={props.closeDialog}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={props.submitDialog}
            />,
        ];
    };

    return (
        <Dialog
            title={props.title}
            actions={getActionButtons()}
            modal={false}
            open={props.showDialog}
            onRequestClose={props.closeDialog} >
            <div>
                <TextField
                    hintText="Message"
                    value={props.message}
                    multiLine={true}
                    onChange={onMessageChange} />
            </div>
        </Dialog>
    );
};

export default DialogWithTextArea;