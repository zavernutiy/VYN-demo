import React from 'react';
import styles from './App.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Drawer, MenuItem, AppBar} from 'material-ui';
import {Link} from 'react-router';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menu: [
                {
                    name: "Recruit",
                    route: "/recruits"
                },
                {
                    name: "Members",
                    route: "/members"
                },
                {
                    name: "Campaigns",
                    route: "/campaigns"
                },
                {
                    name: "Payment Requests",
                    route: "/paymentrequests"
                }
            ]
        };
    }

    getMenuItems() {
        return this.state.menu.map((menu, index) => {
            return (
                <MenuItem
                    key={index}
                    primaryText={menu.name}
                    containerElement={<Link to={menu.route} />}/>
            );
        });
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <Drawer
                        open={true}>
                        <AppBar
                            title="VYN BO"
                            showMenuIconButton={false}/>
                        {this.getMenuItems()}
                    </Drawer>
                </MuiThemeProvider>
                <MuiThemeProvider>
                    <div className={styles.container}>
                        {this.props.children}
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;