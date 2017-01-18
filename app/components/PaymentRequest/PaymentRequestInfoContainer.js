import Relay from 'react-relay';
import PaymentRequestInfoComponent from './PaymentRequestInfoComponent';

let PaymentRequestInfoContainer = Relay.createContainer(PaymentRequestInfoComponent, {
    initialVariables: {
        id: null,
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                paymentRequest (id: $id) {
                    id,
                    requestDate,
                    posts {
                        clicks,
                        campaign {
                            id,
                            customerName,
                            CPCAdvertiser,
                            CPCPublisher,
                            maxRevenue,
                            payable
                        }
                    },
                    member {
                        id,
                        firstName,
                        lastName,
                        blackListStatus,
                        paypalEmail
                    },
                    wasPaid,
                    paypalEmail,
                    reconciliationDate
                }
            }`
    }
});

export default PaymentRequestInfoContainer;