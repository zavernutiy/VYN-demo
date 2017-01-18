import Relay from 'react-relay';
import ExportToGroup from './ExportToGroupComponent';

const ExportToGroupContainer = Relay.createContainer(ExportToGroup, {
    initialVariables: {
        groupLimit: 300,
        exceptType: 0,
        campaignLimit: 200,
        campaignSortField: "startDate",
        campaignSortAscending: false
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                groupConnection (first: $groupLimit, exceptType: $exceptType) {
                    edges {
                        node {
                            id,
                            name,
                            type
                        }
                    }
                },
                campaignConnection (first: $campaignLimit, sortField: $campaignSortField, sortAscending: $campaignSortAscending) {
                    edges {
                        node {
                            id,
                            customerName,
                            userSegments,
                            startDate,
                            group {
                                id
                            }
                        }
                    }
                }
            }`
    }
});

export default ExportToGroupContainer;