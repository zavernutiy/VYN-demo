import Relay from "react-relay";

class ExportToGroupMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation { createEditGroup }
         `;
    }

    getVariables() {
        return {
            groupId: this.props.groupId,
            name: this.props.name,
            type: this.props.type,
            memberIds: this.props.memberIds,
            memberMongoIds: this.props.memberMongoIds,
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on CreateEditGroupPayload {
                groupEdge,
                store { groupConnection }
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
            // I think it should be groupConnection instead of memberConnection
            // But with group connection following error is thrown
            // Uncaught Invariant Violation: RelayMutationQuery: Expected field `groupConnection` on `store` to be a connection.
            connectionName: 'memberConnection',
            edgeName: 'groupEdge',
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
            groupEdge: {
                node: {
                    groupId: this.props.groupId,
                    name: this.props.name,
                    type: this.props.type,
                    memberIds: this.props.memberIds,
                    memberMongoIds: this.props.memberMongoIds,
                }
            }
        };
    }
}

export default ExportToGroupMutation;
