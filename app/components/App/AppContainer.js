import Relay from 'react-relay';
import App from './AppComponent';




let AppContainer = Relay.createContainer(App, {
    fragments: {
        store: () => Relay.QL`
            fragment on Store {
                id
            }
        `,
    },
});

export default AppContainer;