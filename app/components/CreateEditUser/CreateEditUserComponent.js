import React from 'react';
import Relay from 'react-relay';
import { TextField, RaisedButton, Checkbox } from 'material-ui';
import styles from './CreateEditUser.scss';
import CreateUserMutation from './CreateEditUserMutation';

// TODO: Add form validation
// Helpful link
// http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html

// TODO: Save socialGroup info into database

class CreateEditUserComponent extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        relay: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.id ? this.props.store.member.firstName : "",
            secondName: this.props.id ? this.props.store.member.lastName : "",
            email: this.props.store.member.email,
            website: "",
            socialGroup: this.getUserSocialGroups(),
            contacted: false,
            errorMessage: "This field is required",
            socialNetworks: [
                "Facebook",
                "twitter",
                "LinkedIn",
                "Instagram"
            ]
        };
    }

    firstNameChange = (event, firstName) => {
        this.setState({
            firstName: firstName
        });
    };

    secondNameChange = (event, secondName) => {
        this.setState({
            secondName: secondName
        });
    };

    emailChange = (index, event, email) => {
        console.log('index', index);
        console.log('event', event);
        console.log('email', email);
        let emails = this.state.email;
        emails[index] = email;
        this.setState({
            email: emails
        });
    };

    websiteChange = (event, website) => {
        this.setState({
            website: website
        });
    };

    /**
     * Method to change corresponding field of socialGroup
     * */
    socialGroupFieldChange = (field, index, event, value) => {
        event.stopPropagation();
        let socialGroup = this.state.socialGroup;
        socialGroup[index][field] = value;
        /**
         * When user enters data in field, create another social group,
         * so it is possible to add more than one social network
         **/
        if (socialGroup.length == index + 1) {
            socialGroup.push(this.getEmptySocialGroup());
        }
        // If field is website, try to get social network name
        if (field === "networkLink") {
            this.getSocialNetworkName(value, index);
        }
        // If user deletes some field check if social group should be deleted
        this.deleteEmptySocialGroupByIndex(index);
        this.setState({
            socialGroup: socialGroup
        });
    };

    /**
     * Method to get social network name depending on link entered by user
     * The name is set to corresponding socialGroup with the help of index
     * */
    getSocialNetworkName = (link, index) => {
        let socialNetworks = this.state.socialNetworks;
        let socialGroup = this.state.socialGroup;
        let networkName = "";
        link = link.toLowerCase();
        for (let i = 0; i < socialNetworks.length; i++) {
            if (link.includes(socialNetworks[i].toLowerCase())) {
                networkName = socialNetworks[i];
                break;
            }
        }
        socialGroup[index].networkName = networkName;
        this.setState({
            socialGroup: socialGroup
        });
    };

    /**
     * Method to remove empty social group by index
     * */
    deleteEmptySocialGroupByIndex = (index) => {
        let socialGroup = this.state.socialGroup;
        let group = socialGroup[index];
        if (group.networkName.length == 0 &&
            group.networkLink.length == 0 &&
            group.audience.length == 0) {
            socialGroup.splice(index, 1);
            this.setState({
                socialGroup: socialGroup
            });
        }
    };

    /**
     * Method to remove code duplication
     * */
    getEmptySocialGroup() {
        return {
            networkName: "",
            networkLink: "",
            audience: ""
        }
    }

    getUserSocialGroups = () => {
        let userNetwork = this.props.store.member.userNetwork;
        if (userNetwork) {
            console.log('userNetwork', userNetwork);
            let socialGroup = [];
            if (userNetwork.fbLink) {
                socialGroup.push({
                    networkName: "Facebook",
                    networkLink: userNetwork.fbLink,
                    audience: userNetwork.fbMainPageAudience + userNetwork.fbPagesAudience
                });
            }
            if (userNetwork.LinkedInLink) {
                socialGroup.push({
                    networkName: "LinkedIn",
                    networkLink: userNetwork.LinkedInLink,
                    audience: userNetwork.LinkedInAudience
                });
            }
            if (userNetwork.twitterLink) {
                socialGroup.push({
                    networkName: "twitter",
                    networkLink: userNetwork.twitterLink,
                    audience: userNetwork.twitterAudience
                });
            }
            if (userNetwork.instagramLink) {
                socialGroup.push({
                    networkName: "Instagram",
                    networkLink: userNetwork.instagramLink,
                    audience: userNetwork.instagramAudience
                });
            }
            return socialGroup;
        } else {
            return [this.getEmptySocialGroup()];
        }
    };

    contactCheck = (event, isChecked) => {
        this.setState({
            contacted: isChecked
        });
    };

    getSocialGroups = () => {
        return this.state.socialGroup.map((group, index) => {
            return (
                <div className={styles.socialGroup} key={index}>
                    <div>
                        <label className={styles.left}>{group.networkName}</label>
                        <TextField
                            hintText="Social Network"
                            value={group.networkLink}
                            disabled={true}
                            onChange={this.socialGroupFieldChange.bind(this, "networkLink", index)} />
                    </div>
                    <div>
                        <label className={styles.left}>Audience</label>
                        <TextField
                            hintText="Audience"
                            value={group.audience}
                            disabled={true}
                            onChange={this.socialGroupFieldChange.bind(this, "audience", index)} />
                    </div>
                </div>
            );
        });
    };

    getEmails = () => {
        return this.state.email.map((email, index) => {
            return (
                <div key={index}>
                    <label className={styles.left}>Email</label>
                    <TextField
                        hintText="Email"
                        value={email}
                        onChange={this.emailChange.bind(this, index)} />
                </div>
            )
        });
    };

    saveUser = (e) => {
        e.preventDefault();
        let onFailure = (transaction) => {
            var error = transaction.getError() || new Error('Mutation failed.');
            console.error(error);
        };
        let onSuccess = () => {
            console.log("Mutation success");
            this.goBack();
        };
        Relay.Store.commitUpdate(
            new CreateUserMutation({
                name: `${this.state.firstName} ${this.state.secondName}`,
                email: [this.state.email],
                website: this.state.website,
                contacted: this.state.contacted,
                store: this.props.store
            }),
            { onFailure, onSuccess }
        );
        this.clearForm();
    };

    clearForm = () => {
        this.setState({
            firstName: "",
            secondName: "",
            email: "",
            website: "",
            socialGroup: [this.getEmptySocialGroup()],
            contacted: false
        });
    };

    goBack = () => {
        this.context.router.goBack();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.saveUser} className={styles.userForm}>
                    <div>
                        <label className={styles.left}>First Name</label>
                        <TextField
                            hintText="First Name"
                            className={styles.right}
                            value={this.state.firstName}
                            onChange={this.firstNameChange} />
                    </div>
                    <div>
                        <label className={styles.left}>Second Name</label>
                        <TextField
                            hintText="Second Name"
                            value={this.state.secondName}
                            onChange={this.secondNameChange} />
                    </div>
                    {this.getEmails()}
                    <div>
                        <label className={styles.left}>Website</label>
                        <TextField
                            hintText="Website"
                            value={this.state.website}
                            onChange={this.websiteChange} />
                    </div>
                    {this.getSocialGroups()}
                    <Checkbox
                        label="Contacted"
                        className={styles.contacted}
                        checked={this.state.contacted}
                        onCheck={this.contactCheck} />
                    <RaisedButton type="submit" label="Submit"/>
                </form>
            </div>
        );
    }
}

export default CreateEditUserComponent;