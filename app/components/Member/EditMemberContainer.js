import Relay from 'react-relay';
import EditMember from './EditMemberComponent';

let EditMemberContainer = Relay.createContainer(EditMember, {
    initialVariables: {
        id: null
    },
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                member(id: $id) {
                    id,
                    firstName,
                    lastName,
                    email,
                    website,
                    gender,
                    country,
                    language,
                    userInterests,
                    mongoId,
                    userSegment,
                    blackListStatus,
                    socialNetworks {
                        id,
                        type,
                        providerId,
                        link,
                        audience,
                        userInterests,
                        userSegment
                    }
                }
            }`
    }
});

export default EditMemberContainer;