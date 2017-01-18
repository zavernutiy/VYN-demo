import Relay from "react-relay";

class EditMemberMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation { editMember }
         `;
    }

    getVariables() {
        return {
            id: this.props.id,
            mongoId: this.props.mongoId,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email,
            website: this.props.website,
            gender: this.props.gender,
            country: this.props.country,
            language: this.props.language,
            interests: this.props.interests,
            segment: this.props.segment,
            socialNetworks: this.props.socialNetworks,
            blackListStatus: this.props.blackListStatus
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on EditMemberPayload {
                memberEdge,
                store { memberConnection }
            }
        `;
    }

    // Helpful link for rangeBehaviors
    // http://mgiroux.me/2016/the-mysterious-relay-range-behaviours/
    getConfigs() {
        return [{
            type: 'RANGE_ADD',
            parentName: 'store',
            parentID: this.props.store.id,
            connectionName: 'memberConnection',
            edgeName: 'memberEdge',
            rangeBehaviors: {
                '': 'append',
                'status(any)': 'append',
                'status(active)': 'append',
                'status(completed)': 'ignore'
            },
        }];
    }

    getOptimisticResponse() {
        return {
            memberEdge: {
                node: {
                    id: this.props.id,
                    mongoId: this.props.mongoId,
                    firstName: this.props.firstName,
                    lastName: this.props.lastName,
                    email: this.props.email,
                    website: this.props.website,
                    gender: this.props.gender,
                    country: this.props.country,
                    language: this.props.language,
                    interests: this.props.interests,
                    segment: this.props.segment,
                    socialNetworks: this.props.socialNetworks,
                    blackListStatus: this.props.blackListStatus
                }
            }
        };
    }
}

export default EditMemberMutation;
