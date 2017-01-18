import React from 'react';
import TextField from 'material-ui/TextField';
import styles from './Form.scss';
import InterestSelector from './InterestSelectorFormComponent';
import SegmentSelect from './SegmentSelectFormComponent';

class SocialGroup extends React.Component {
    onSegmentChange = (userSegment) => {
        let { userInterests } = this.props;
        this.props.updateSocialGroup(this.props.id, { userInterests, userSegment });
    };

    onInterestChange = (userInterests) => {
        let { userSegment } = this.props;
        this.props.updateSocialGroup(this.props.id, { userInterests, userSegment });
    };

    render() {
        return (
            <div>
                <div className={styles.socialGroup}>
                    <div>
                        <label className={styles.left}>
                            <a href={this.props.networkLink} target="_blank">{this.props.networkName}</a>
                        </label>
                        <TextField
                            className={styles.right}
                            hintText="Social Network"
                            value={this.props.networkLink}
                            disabled={true} />
                    </div>
                    <div>
                        <label className={styles.left}>Audience</label>
                        <TextField
                            className={styles.right}
                            hintText="Audience"
                            value={this.props.audience}
                            disabled={true} />
                    </div>
                    <InterestSelector
                        userInterests={this.props.userInterests}
                        id={this.props.id}
                        onInterestChange={this.onInterestChange} />
                    <SegmentSelect
                        userSegment={this.props.userSegment}
                        onSegmentChange={this.onSegmentChange} />
                </div>
            </div>
        )
    }
}

export default SocialGroup;