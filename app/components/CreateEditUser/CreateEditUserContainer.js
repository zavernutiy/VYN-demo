import Relay from 'react-relay';
import CreateEditUser from './CreateEditUserComponent';

// TODO: Remove not needed query variables

let CreateEditUserContainer = Relay.createContainer(CreateEditUser, {
    initialVariables: {
        id: null
    },
/*    prepareVariables: (variables) => {
        console.log('variables', variables);
        if (variables.id)
            return { ...variables, id: variables.id };
        else
            return variables;
    },*/
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id,
                member(id: $id) {
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
            }`
    }
});

export default CreateEditUserContainer;