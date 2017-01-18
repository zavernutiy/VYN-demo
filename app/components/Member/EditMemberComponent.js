import React from 'react';
import Relay from 'react-relay';
import RaisedButton from 'material-ui/RaisedButton';
import EditMemberMutation from './EditMemberMutation';
import Name from '../Form/NameFormComponent';
import Email from '../Form/EmailFormComponent';
import Website from '../Form/WebsiteUrlInputFormComponent';
import SocialGroupList from '../Form/SocialGroupListFormComponent';
import InterestSelector from '../Form/InterestSelectorFormComponent';
import SegmentSelect from '../Form/SegmentSelectFormComponent';
import GenderSelect from '../Form/GenderSelectFormComponent';
import CountrySelect from '../Form/CountrySelectFormComponent';
import LanguageSelect from '../Form/LanguageSelectFormComponent';
import ToggleWithLabel from '../Form/ToggleWithLabelFormComponent';

import 'react-select/dist/react-select.css';
import styles from './Members.scss';

class EditMember extends React.Component {
    /**
     * Require router to have possibility to navigate from component
     * */
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            mongoId: this.props.store.member.mongoId,
            firstName: this.props.store.member.firstName,
            lastName: this.props.store.member.lastName,
            email: this.props.store.member.email,
            website: this.props.store.member.website ? this.props.store.member.website : "",
            gender: this.props.store.member.gender ? this.props.store.member.gender : "",
            country: this.props.store.member.country ? this.props.store.member.country : "",
            language: this.props.store.member.language ? this.props.store.member.language : "",
            userInterests: this.props.store.member.userInterests,
            userSegment: this.props.store.member.userSegment,
            errorMessage: "This field is required",
            socialGroups: this.getUserSocialGroups(),
            blackListStatus: this.props.store.member.blackListStatus ? this.props.store.member.blackListStatus : false
        };
    }

    firstNameChange = (event, firstName) => {
        this.setState({
            firstName: firstName
        });
    };

    lastNameChange = (event, lastName) => {
        this.setState({
            lastName: lastName
        });
    };

    emailChange = (index, event, email) => {
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

    genderChange = (gender) => {
        this.setState({gender});
    };

    countryChange = (country) => {
        this.setState({country});
    };

    languageChange = (language) => {
        this.setState({language});
    };

    getUserSocialGroups = () => {
        let socialNetworks = this.props.store.member.socialNetworks;
        if (socialNetworks) {
            let userSocialGroups = socialNetworks.map((socialNetwork) => {
                return {
                    id: socialNetwork.id,
                    networkName: this.getSocialNetworkName(socialNetwork),
                    networkLink: socialNetwork.link,
                    audience: socialNetwork.audience,
                    userInterests: socialNetwork.userInterests,
                    userSegment: parseInt(socialNetwork.userSegment),
                    type: socialNetwork.type
                };
            });
            // Sorting social groups
            // Groups with largest audience will be on top
            return userSocialGroups.sort((a, b) => {
                return b.audience - a.audience;
            });
        } else {
            return [];
        }
    };

    getSocialNetworks = (socialGroups) => {
        if (socialGroups) {
            return socialGroups.map(socialGroup => {
                return {
                    id: socialGroup.id,
                    userInterests: socialGroup.userInterests,
                    userSegment: socialGroup.userSegment
                }
            });
        }
        return [];
    };

    getSocialNetworkName = (socialNetwork) => {
        switch (socialNetwork.type) {
            case 'facebook':
                return 'Facebook';
            case 'facebookPage':
                return 'Facebook';
            case 'linkedin':
                return 'LinkedIn';
            case 'twitter':
                return 'Twitter';
            case 'instagram':
                return 'Instagram';
        }
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
        console.log('this.state.socialGroups', this.state.socialGroups);
        Relay.Store.commitUpdate(
            new EditMemberMutation({
                id: this.state.id,
                mongoId: this.state.mongoId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                website: this.state.website,
                gender: this.state.gender,
                country: this.state.country,
                language: this.state.language,
                interests: this.state.userInterests,
                segment: this.state.userSegment,
                socialNetworks: this.getSocialNetworks(this.state.socialGroups),
                blackListStatus: this.state.blackListStatus,
                store: this.props.store
            }),
            { onFailure, onSuccess }
        );
    };

    goBack = () => {
        this.context.router.goBack();
    };

    /**
     * Function that updates array of social groups by given id
     * @param id
     * @param socialGroup
     */
    updateSocialGroup = (id, socialGroup) => {
        let { userInterests, userSegment } = socialGroup;
        this.setState({
            socialGroups: this.state.socialGroups.map((stateSocialGroup) => {
                if (stateSocialGroup.id == id) {
                    return Object.assign({}, stateSocialGroup, {
                        userInterests,
                        userSegment
                    });
                } else {
                    return stateSocialGroup;
                }
            })
        })
    };

    onInterestChange = (userInterests) => {
        this.setState({userInterests});
    };

    onSegmentChange = (userSegment) => {
        this.setState({userSegment});
    };

    blackListToggle = (blackListStatus) => {
        this.setState({blackListStatus});
    };

    render() {
        return (
            <div>
                <h1 className={styles.title}>{`${this.state.firstName} ${this.state.lastName}`}</h1>
                <form onSubmit={this.saveUser} className={styles.userForm}>
                    <Name
                        firstName={this.state.firstName}
                        firstNameChange={this.firstNameChange}
                        lastName={this.state.lastName}
                        lastNameChange={this.lastNameChange} />
                    <Email
                        email={this.state.email}
                        emailChange={this.emailChange} />
                    <Website
                        website={this.state.website}
                        websiteChange={this.websiteChange} />
                    <GenderSelect
                        gender={this.state.gender}
                        onGenderChange={this.genderChange} />
                    <CountrySelect
                        country={this.state.country}
                        onCountryChange={this.countryChange} />
                    <LanguageSelect
                        language={this.state.language}
                        onLanguageChange={this.languageChange} />
                    <ToggleWithLabel
                        title="Black list status"
                        toggled={this.state.blackListStatus}
                        onToggle={this.blackListToggle} />
                    <InterestSelector
                        userInterests={this.state.userInterests}
                        onInterestChange={this.onInterestChange} />
                    <SegmentSelect
                        userSegment={this.state.userSegment}
                        onSegmentChange={this.onSegmentChange} />
                    <SocialGroupList
                        socialGroups={this.state.socialGroups}
                        updateSocialGroup={this.updateSocialGroup} />
                    <RaisedButton className={styles.submit} type="submit" label="Submit"/>
                </form>
            </div>
        );
    }
}

export default EditMember;