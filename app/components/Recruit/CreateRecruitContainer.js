import Relay from 'react-relay';
import CreateRecruit from './CreateRecruitComponent';

// TODO: Remove not needed query variables
let CreateRecruitContainer = Relay.createContainer(CreateRecruit, {
    initialVariables: {
        limit: 15,
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                memberConnection(first: $limit) {
                    edges {
                        node {
                            id,
                            firstName,
                            lastName,
                            email
                        }
                    }
                }
            }`
    }
});

export default CreateRecruitContainer;