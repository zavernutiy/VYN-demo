import React from 'react';
import Select from 'react-select';
import interests from '../../../lib/interests';
import styles from './Form.scss';

class InterestSelector extends React.Component {
    static propTypes = {
        userInterests: React.PropTypes.array.isRequired,
        id: React.PropTypes.string
    };

    static defaultProps = {
        userInterests: [],
        id: null
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedDiv: null,
            selectedInterest: null
        };
    }

    getInterests = () => {
        return interests.interests.map((interest) => {
            return this.getSelectorItem(interest);
        });
    };

    getSubInterests = () => {
        if (this.state.selectedInterest) {
            if (interests.subInterests.hasOwnProperty(this.state.selectedInterest)) {
                return interests.subInterests[this.state.selectedInterest].map(subInterest => this.getSelectorItem(subInterest));
            } else {
                return [];
            }
        } else {
            return [];
        }
    };

    /**
     * This method takes string value, and returns object that is used by Selector component
     * */
    getSelectorItem (value) {
        return {
            value: value,
            label: value
        }
    };

    interestClick = (value, event) => {
        if (event.target.parentNode.className.indexOf(styles.selectedValue) === -1) {
            this.selectInterest(value.value, event.target.parentNode);
        } else {
            event.target.parentNode.className = event.target.parentNode.className.replace(styles.selectedValue, "").trim();
            this.setState({
                selectedDiv: null,
                selectedInterest: null
            });
        }
    };

    selectInterest = (selectedInterest, selectedDiv) => {
        this.removePreviousSelectedDivSelection();
        if (selectedDiv) {
            selectedDiv.className += ` ${styles.selectedValue}`;
        }
        let userInterests = this.props.userInterests;
        if (!userInterests) return;

        let subInterests = this.getSelectedSubInterests(selectedInterest);
        this.setState({
            selectedDiv,
            selectedInterest,
            subInterests
        });
    };

    /**
     * Method that removes selectedClass from this.state.selectedDiv
     * */
    removePreviousSelectedDivSelection = () => {
        let previousSelectedDiv = this.state.selectedDiv;
        if (previousSelectedDiv) {
            previousSelectedDiv.className = previousSelectedDiv.className.replace(styles.selectedValue).trim();
        }
    };

    getSelectedInterestsStringArray = () => {
        let { userInterests } = this.props;
        if (!userInterests) return [];

        let selectedInterests = [];

        userInterests.forEach((interest) => {
            if (!interest) return;
            if (interest.indexOf("|") != -1 && interest) {
                let [ mainInterest ] = interest.split("|");
                // Check if such item already exists in selected interests
                if (selectedInterests.indexOf(mainInterest) == -1) {
                    selectedInterests.push(mainInterest);
                }
            } else {
                if (selectedInterests.indexOf(interest) == -1) {
                    selectedInterests.push(interest);
                }
            }
        });

        return selectedInterests;
    };

    getSelectedInterests = () => {
        return this.getSelectedInterestsStringArray().map(interest => this.getSelectorItem(interest));
    };

    getSelectedSubInterestsStringArray = (selectedInterest) => {
        let { userInterests } = this.props;
        if (!userInterests || !selectedInterest) return [];

        let subInterests = [];
        userInterests.forEach((userInterest) => {
            if (userInterest.indexOf(`${selectedInterest}|`) != -1) {
                // Sub interest are listed after pipe
                subInterests.push(userInterest.split("|")[1]);
            }
        });

        return subInterests
    };

    getSelectedSubInterests = (selectedInterest) => {
        return this.getSelectedSubInterestsStringArray(selectedInterest).map(subInterest => this.getSelectorItem(subInterest));
    };

    onInterestChange = (interests) => {
        // All interests were deleted
        if (!interests) {
            this.props.onInterestChange([]);
            return;
        }

        let { userInterests } = this.props;
        let selectedInterests = this.getSelectedInterests();
        if (interests.length > selectedInterests.length) {
            // New interest was added, push it to userInterests and call props function
            userInterests.push(interests[interests.length - 1].value);
            this.props.onInterestChange(userInterests);
        } else {
            // One item was deleted
            let interestsStringArray = interests.map(interest => interest.value);
            this.props.onInterestChange(userInterests.filter((userInterest) => {
                if (userInterest.indexOf("|") != -1) {
                    return interestsStringArray.indexOf(userInterest.split("|")[0]) != -1;
                } else {
                    return interestsStringArray.indexOf(userInterest) != -1;
                }
            }));
        }
    };

    onSubInterestChange = (subInterests) => {
        let { userInterests } = this.props;
        let { selectedInterest } = this.state;
        if (!selectedInterest) return;
        // All sub interests were deleted
        if (!subInterests) {
            this.props.onInterestChange(userInterests.filter((userInterest) => {
                return userInterest.indexOf(`${selectedInterest}|`) == -1;
            }));
            return;
        }

        let selectedSubInterests = this.getSelectedSubInterests(this.state.selectedInterest);
        if (subInterests.length > selectedSubInterests.length) {
            // One sub interest was added
            userInterests.push(`${selectedInterest}|${subInterests[subInterests.length - 1].value}`);
            this.props.onInterestChange(userInterests);
        } else {
            // One sub interest was deleted
            let subInterestsStringArray = subInterests.map(subInterests => subInterests.value);
            this.props.onInterestChange(userInterests.filter((userInterest) => {
                if (userInterest.indexOf(`${selectedInterest}|`) != -1) {
                    return subInterestsStringArray.indexOf(userInterest.split("|")[1]) != -1;
                } else {
                    return true;
                }
            }));
        }
    };

    render () {
        return (
            <div>
                <Select
                    name="select-interest"
                    multi={true}
                    value={this.getSelectedInterests()}
                    options={this.getInterests()}
                    onChange={this.onInterestChange}
                    onValueClick={this.interestClick} />
                <Select
                    name="select-sub-interest"
                    className={styles.marginTop}
                    multi={true}
                    value={this.getSelectedSubInterests(this.state.selectedInterest)}
                    options={this.getSubInterests()}
                    onChange={this.onSubInterestChange}
                />
            </div>
        );
    }
}

export default InterestSelector;