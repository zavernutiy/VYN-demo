import React from 'react';
import SocialGroup from './SocialGroupFormComponent';

class SocialGroupList extends React.Component {
    static propTypes = {
        socialGroups: React.PropTypes.array.isRequired
    };

    static defaultProps = {
        socialGroups: []
    };

    renderSocialGroups = () => {
        let socialGroups = this.props.socialGroups;
        if (socialGroups) {
            return socialGroups.map((socialGroup) => {
                return (
                    <SocialGroup
                        key={socialGroup.id}
                        id={socialGroup.id}
                        networkName={socialGroup.networkName}
                        networkLink={socialGroup.networkLink}
                        audience={socialGroup.audience}
                        userInterests={socialGroup.userInterests}
                        userSegment={socialGroup.userSegment}
                        updateSocialGroup={this.props.updateSocialGroup}
                    />
                );
            });
        }
    };

    render () {
        return (
            <div>
                {this.renderSocialGroups()}
            </div>
        );
    }
}

export default SocialGroupList;