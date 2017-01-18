import React from 'react';
import ReactDataGrid from 'react-data-grid';
import '../../../node_modules/react-data-grid/themes/react-data-grid.css'
import FAB from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import styles from './Recruits.scss';

class RecruitsComponent extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            recruits: this.props.store.memberConnection.edges.map((edge) => {
                return {
                    id: edge.node.id,
                    name: edge.node.name,
                    // emails are returned in array.
                    // If there are more than one email separate emails by coma
                    email: edge.node.email.join(", ")
                }
            })
        };
    }

    getDataGrid() {
        let columns = [
            {
                key: 'name',
                name: 'Name'
            },
            {
                key: 'email',
                name: 'Email'
            }
        ];

        return (
            <ReactDataGrid
                rowGetter={this.getDataRow}
                rowsCount={this.state.recruits.length}
                minHeight={500}
                columns={columns} />
        );
    }

    getDataRow = (index) => {
        return this.state.recruits[index];
    };

    createRecruitRedirect = () => {
        this.context.router.push('/recruits/create');
    };

    render() {
        return (
            <div>
                <h1>Recruits</h1>
                {this.getDataGrid()}
                <FAB
                    onTouchTap={this.createRecruitRedirect}
                    className={styles.addMember}
                    mini={true}>
                    <AddIcon/>
                </FAB>
            </div>
        )
    }
}

export default RecruitsComponent;