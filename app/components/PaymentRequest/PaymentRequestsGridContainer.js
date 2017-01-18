import Relay from 'react-relay';
import PaymentRequestsGridComponent from './PaymentRequestsGridComponent';

let PaymentRequestContainer = Relay.createContainer(PaymentRequestsGridComponent, {
    initialVariables: {
        limit: 200,
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                paymentRequestConnection {
                    edges {
                        node {
                            id,
                            requestDate,
                            posts {
                                clicks,
                                campaign {
                                    CPCAdvertiser,
                                    CPCPublisher,
                                    maxRevenue,
                                    payable,
                                }
                            },
                            member {
                                id,
                                firstName,
                                lastName,
                                blackListStatus,
                                paypalEmail,
                                mongoId
                            },
                            wasPaid,
                            paypalEmail,
                            reconciliationDate
                        }
                    }
                }
            }`
    }
});

export default PaymentRequestContainer;