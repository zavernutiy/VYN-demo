import React from 'react';
import Relay from 'react-relay';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ExportToGroupMutation from './ExportToGroupMutation';
import constants from '../../../lib/constants';

import styles from './ExportToGroup.scss';

class ExportToGroup extends React.Component {
    static propTypes = {
        showGroupDialog: React.PropTypes.bool.isRequired,
        closeGroupDialog: React.PropTypes.func.isRequired,
        memberIds: React.PropTypes.array.isRequired,
        type: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        let title = "Export users to group";
        let message = "Create a new group or choose from existing";
        if (props.type == constants.groupTypes.campaignGroup) {
            title = "Export users to campaign group";
            message = "Choose from existing campaign groups";
        }
        this.state = {
            title: title,
            message: message,
            groupId: null,
            groupName: "",
            groupType: "",
            existingGroups: []
        };
    }

    groupChange = (event, index, value) => {
        let selectedGroup;
        if (this.props.type == constants.groupTypes.campaignGroup) {
            this.props.store.campaignConnection.edges.forEach(edge => {
                if (edge.node.group.id == value) {
                    selectedGroup = {
                        name: this.getCampaignGroupName(edge),
                        id: edge.node.group.id,
                        type: 0
                    };
                }
            });
        } else {
            this.props.store.groupConnection.edges.forEach(edge => {
                if (edge.node.id == value) {
                    selectedGroup = edge.node;
                }
            });
        }
        this.setState({
            groupId: value,
            groupName: selectedGroup ? selectedGroup.name : "",
            groupType: selectedGroup ? selectedGroup.type : ""
        });
    };

    groupNameChange = (event) => {
        this.setState({groupName: event.target.value});
    };

    groupTypeChange = (event) => {
        this.setState({groupType: event.target.value});
    };

    submitGroupDialog = () => {
        let onFailure = (transaction) => {
            var error = transaction.getError() || new Error('Mutation failed.');
            console.error(error);
        };
        let onSuccess = () => {
            console.log("Mutation success");
            this.props.closeGroupDialog();
        };
        Relay.Store.commitUpdate(
            new ExportToGroupMutation({
                groupId: this.state.groupId,
                name: this.state.groupName,
                type: parseInt(this.state.groupType),
                memberIds: this.props.memberIds,
                memberMongoIds: this.props.memberMongoIds,
                store: this.props.store
            }),
            { onFailure, onSuccess }
        );
    };

    getActionButtons = () => {
        return [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.closeGroupDialog}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.submitGroupDialog}
            />,
        ]
    };

    getExistingGroups = () => {
        let existingGroups = [<MenuItem key={-1} value={null} primaryText="None" />];
        if (this.props.type == constants.groupTypes.campaignGroup) {
            this.props.store.campaignConnection.edges.forEach((edge, index) => {
                existingGroups.push(<MenuItem key={index} value={edge.node.group.id} primaryText={this.getCampaignGroupName(edge)} />);
            });
        } else {
            this.props.store.groupConnection.edges.forEach((edge, index) => {
                existingGroups.push(<MenuItem key={index} value={edge.node.id} primaryText={edge.node.name} />);
            });
        }
        return existingGroups;
    };

    getCampaignGroupName = (edge) => {
        const segments = edge.node.userSegments ? edge.node.userSegments.join(", ") : "";
        const startDate = new Date(edge.node.startDate).toLocaleDateString("en-GB");
        return `${edge.node.customerName} (${segments}) ${startDate}`;
    };

    render () {
        return (
            <Dialog
                title={this.state.title}
                actions={this.getActionButtons()}
                modal={false}
                open={this.props.showGroupDialog}
                onRequestClose={this.props.closeGroupDialog} >
                <p>{this.state.message}</p>
                <div>
                    <label className={styles.left}>Choose existing group</label>
                    <SelectField value={this.state.groupId} onChange={this.groupChange}>
                        {this.getExistingGroups()}
                    </SelectField>
                </div>
                <div>
                    <label className={styles.left}>Group name</label>
                    <TextField
                        hintText="Group name"
                        disabled={this.props.type == constants.groupTypes.campaignGroup}
                        value={this.state.groupName}
                        onChange={this.groupNameChange} />
                </div>
                {
                    this.props.type == constants.groupTypes.campaignGroup ? null :
                        <div>
                            <label className={styles.left}>Group type</label>
                            <TextField
                                hintText="Group type"
                                disabled={this.props.type == constants.groupTypes.campaignGroup}
                                value={this.state.groupType}
                                onChange={this.groupTypeChange} />
                        </div>
                }
            </Dialog>
        );
    }
}

export default ExportToGroup;