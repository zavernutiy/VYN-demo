import Relay from 'react-relay';
import CampaignComponent from './CampaignsGridComponent';

let CampaignContainer = Relay.createContainer(CampaignComponent, {
    initialVariables: {
        limit: 1000,
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                campaignConnection(first: $limit) {
                    edges {
                        node {
                            id,
                            mongoId,
                            name,
                            networks,
                            userSegments,
                            interests,
                            CPCAdvertiser,
                            CPCPublisher,
                            maxRevenue,
                            totalBudget,
                            status,
                            emailSent,
                            startDate,
                            user {
                                id,
                                mongoId
                                firstName,
                                lastName,
                                email
                            },
                            group {
                                id,
                                membersAmount
                            },
                            payable
                        }
                    }
                }
            }`
    }
});

export default CampaignContainer;