import Relay from 'react-relay';
import Recruits from './RecruitsGridComponent';

let RecruitsContainer = Relay.createContainer(Recruits, {
    initialVariables: {
        limit: 15,
        sortField: 'createdAt',
        sortAscending: false
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                memberConnection(first: $limit, 
                                    sortField: $sortField, 
                                    sortAscending: $sortAscending) {
                    edges {
                        node {
                            id,
                            firstName,
                            lastName,
                            email,
                            socialNetworks {
                                id,
                                type,
                                providerId,
                                link,
                                audience
                            }
                        }
                    }
                }
            }`
    }
});

export default RecruitsContainer;