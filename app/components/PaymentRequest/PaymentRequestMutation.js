import Relay from "react-relay";

class PaymentRequestMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation { editPaymentRequest }
         `;
    }

    getVariables() {
        return {
            id: this.props.id
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on PaymentRequestPayload {
                paymentRequestEdge,
                store { paymentRequest }
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
            connectionName: 'paymentRequestConnection',
            edgeName: 'paymentRequestEdge',
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
            paymentRequestEdge: {
                node: {
                    id: this.props.id,
                }
            }
        };
    }
}

export default PaymentRequestMutation;
