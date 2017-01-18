import Relay from 'react-relay';

export default {
    store: (Component, vars) => Relay.QL`
        query MainQuery {
            store { ${Component.getFragment('store', vars)} }
        }`
}
