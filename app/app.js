import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { browserHistory, applyRouterMiddleware, Router } from 'react-router';
import useRelay from 'react-router-relay';
import Route from './routes/Route';
import './GridStyle.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
    <Router history={browserHistory} routes={Route} render={applyRouterMiddleware(useRelay)} environment={Relay.Store} />,
    document.getElementById('root')
);

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer('/graphql', {
        fetchTimeout: 60000,   // Timeout after 30s.
        retryDelays: [5000],   // Only retry once after a 5s delay.
    })
);

