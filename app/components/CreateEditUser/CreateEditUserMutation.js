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
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email,
            website: this.props.website,
            contacted: this.props.contacted,
        }
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
        }]
    }

    getOptimisticResponse() {
        return {
            memberEdge: {
                node: {
                    name: this.props.name,
                    email: this.props.email,
                    website: this.props.website,
                    contacted: this.props.contacted,
                }
            }
        }
    }
}

export default EditMemberMutation;
