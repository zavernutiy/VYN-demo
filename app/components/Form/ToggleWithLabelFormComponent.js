import React from 'react';
import Toggle from 'material-ui/Toggle';

const ToggleComponent = (props) => {
    const styles = {
        container: {
            height: 48
        },
        label: {
            width: "30%",
            height: 48,
            lineHeight: "48px"
        },
        toggle: {
            width: "70%",
            display: "inline-block",
            right: 0,
            color: "red"
        },
    };

    const onToggle = (event, toggle) => {
        props.onToggle(toggle);
    };

    return (
        <div style={styles.container}>
            <label style={styles.label}>{props.title}</label>
            <Toggle
                disabled={props.disableToggled ? props.toggled : false}
                style={styles.toggle}
                toggled={props.toggled}
                onToggle={onToggle} />
        </div>
    );
};

export default ToggleComponent;