# Value Your Network backoffice

This web application is a backoffice for value your network website. It is built on Relay + GraphQL + Parse Server.  
The project is made on base of [Relay Starter Kit](https://github.com/relayjs/relay-starter-kit). This kit includes an app server, a GraphQL server, and a transpiler that you can use to get started building an app with Relay. For a walkthrough, see the [Relay tutorial](https://facebook.github.io/relay/docs/tutorial.html).

## Installation

```
npm install
```

## Running

Start a local, staging or production server:

```
 ./start.sh local
 ./start.sh staging
 ./start.sh prod


```
If project is not building it can be because of wrong route in react-data-grid css file.
To solve this problem go to /node_modules/react-data-grid/themes/react-data-grid.css and change @import './node_modules/react-select/less/select.less'; on @import '/node_modules/react-select/less/select.less';

## Developing

Any changes you make to files in the `app/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.app`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm run update-schema
npm start
```

## License

Relay Starter Kit is [BSD licensed](./LICENSE). We also provide an additional [patent grant](./PATENTS).

## Ports
Web App is running on [application](http://localhost:8095)
has /graphql as endpoint
API server is  running on [application](http://localhost:8096)
has /parse as endpoint
has /dashboard as endpoint
has /migration as endpoint
webpack Listening at [application](localhost:3001)
