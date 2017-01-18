import Relay from "react-relay";

class EditCampaignMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation { editCampaign }
         `;
    }

    getVariables() {
        return {
            id: this.props.id,
            status: this.props.status,
            payable: this.props.payable
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on EditCampaignPayload {
                campaignEdge,
                store { campaignConnection }
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
            connectionName: 'campaignConnection',
            edgeName: 'campaignEdge',
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
            campaignEdge: {
                node: {
                    id: this.props.id,
                    status: this.props.status,
                    payable: this.props.payable
                }
            }
        };
    }
}

export default EditCampaignMutation;
