import Relay from 'react-relay';
import Members from './MembersGridComponent';
import ExportToGroup from '../ExportToGroup/ExportToGroupContainer';

let MembersContainer = Relay.createContainer(Members, {
    initialVariables: {
        limit: 10000,
        sortField: 'createdAt',
        sortAscending: false,
        groupId: "",
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
                            mongoId,
                            firstName,
                            lastName,
                            email,
                            registrationDate,
                            lastConnectionDate,
                            publisherStatus,
                            blackListStatus,
                            userInterests,
                            userSegment,
                            qualified,
                            gender,
                            country,
                            language,
                            blackListStatus,
                            socialNetworks {
                                id,
                                type,
                                providerId,
                                link,
                                audience,
                                userInterests
                            }
                        }
                    }
                },
                group(id: $groupId) {
                    id
                    members {
                        id,
                        mongoId,
                        firstName,
                        lastName,
                        email,
                        registrationDate,
                        lastConnectionDate,
                        publisherStatus,
                        blackListStatus,
                        userInterests,
                        userSegment,
                        qualified,
                        gender,
                        country,
                        language,
                        socialNetworks {
                            id,
                            type,
                            providerId,
                            link,
                            audience,
                            userInterests
                        }
                    }
                },
                # Writing this line of code to get data for nested container
                ${ExportToGroup.getFragment('store')}
            }`
    }
});

export default MembersContainer;