import React from 'react';
import Relay from 'react-relay';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data, Editors} from 'react-data-grid/addons';
import LinkToMembers from '../LinkToMembers/LinkToMembers';
import DateFormatter from '../DateGridFormatter/DateGridFormatter';
import EditCampaignMutation from './EditCampaignMutation';

var Selectors = Data.Selectors;
var DropDownEditor = Editors.DropDownEditor;

// import '../../../node_modules/react-data-grid/themes/react-data-grid.css'

class CampaignsComponent extends React.Component {
    constructor(props) {
        super(props);
        // let options = ["1", "2", "3", "4", "5"];
        let statusOptions = ["1", "2", "3", "4", "5"];
        let payableOptions = ["Yes", "No"];
        this.state = {
            rows: this.getOriginalRows(),
            filters: {},
            sortColumn: null,
            sortDirection: null,
            columns: [
                {
                    key: 'name',
                    name: 'Name',
                    sortable: true,
                    filterable: true
                },
                {
                    key: 'networks',
                    name: 'Networks',
                    filterable: true
                },
                {
                    key: 'userSegments',
                    name: 'Segments',
                    sortable: true
                },
                {
                    key: 'interests',
                    name: 'Interests',
                    filterable: true
                },
                {
                    key: 'CPCAdvertiser',
                    name: 'CPC Advertiser',
                    sortable: true
                },
                {
                    key: 'CPCPublisher',
                    name: 'CPC Publisher',
                    sortable: true
                },
                {
                    key: 'maxRevenue',
                    name: 'Max revenue',
                    sortable: true
                },
                {
                    key: 'totalBudget',
                    name: 'Total budget',
                    sortable: true,
                },
                {
                    key: 'status',
                    name: 'Status',
                    editor: <DropDownEditor options={statusOptions}/>,
                    sortable: true,
                },
                {
                    key: 'startDate',
                    name: 'Start date',
                    sortable: true,
                    formatter: DateFormatter
                },
                {
                    key: 'membersAmount',
                    name: 'Members',
                    sortable: true,
                    formatter: LinkToMembers,
                    getRowMetaData: (row) => row.groupId
                },
                {
                    key: 'payable',
                    name: 'Payable',
                    editor: <DropDownEditor options={payableOptions}/>,
                },
            ]
        }
    }

    getDataGrid = () => {
        return (
            <ReactDataGrid
                onGridSort={this.handleGridSort}
                enableCellSelect={true}
                columns={this.getColumns()}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}
                minHeight={700}
                toolbar={<Toolbar enableFilter={true}/>}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}
                onGridRowsUpdated={this.handleGridRowsUpdated}
            />
        )
    };

    getColumns = () => {
        return this.state.columns;
    };

    getRows = () => {
        return Selectors.getRows(this.state);
    };

    getSize = () => {
        return this.getRows().length;
    };

    rowGetter = (rowIdx) => {
        var rows = this.getRows();
        return rows[rowIdx];
    };

    handleGridSort = (sortColumn, sortDirection) => {
        var state = Object.assign({}, this.state, {
            sortColumn: sortColumn,
            sortDirection: sortDirection,
            rows: sortDirection === 'NONE' ? this.getOriginalRows() : this.state.rows
        });
        this.setState(state);
    };

    handleFilterChange = (filter) => {
        var newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({filters: newFilters});
    };

    onClearFilters = () => {
        //all filters removed
        this.setState({filters: {}});
    };

    getOriginalRows = () => {
        return this.props.store.campaignConnection.edges.map((edge) => {
            return {
                id: edge.node.id,
                name: edge.node.name,
                networks: edge.node.networks,
                userSegments: edge.node.userSegments ? edge.node.userSegments.join(", ") : "",
                interests: edge.node.interests,
                CPCAdvertiser: edge.node.CPCAdvertiser,
                CPCPublisher: edge.node.CPCPublisher,
                maxRevenue: edge.node.maxRevenue,
                totalBudget: edge.node.totalBudget,
                status: edge.node.status,
                membersAmount: edge.node.group.membersAmount,
                groupId: edge.node.group.id,
                startDate: edge.node.startDate,
                payable: edge.node.payable ? "Yes" : "No"
            }
        });
    };

    handleGridRowsUpdated = (updatedRowData) => {
        let rows = this.state.rows;

        // console.log("updatedRowData", updatedRowData);

        for (let i = updatedRowData.fromRow; i <= updatedRowData.toRow; i++) {
            // Object assign updates corresponding properties of rows[i]
            // object with values from updatedRowData.updated object
            Object.assign(rows[i], updatedRowData.updated);
            this.updateCampaign(rows[i]);
        }

        this.setState({rows: rows});
    };

    updateCampaign = (row) => {
        let onFailure = (transaction) => {
            var error = transaction.getError() || new Error('Mutation failed.');
            console.error(error);
        };
        let onSuccess = () => {
            console.log("Mutation success");
        };
        Relay.Store.commitUpdate(
            new EditCampaignMutation({
                id: row.id,
                status: parseInt(row.status),
                payable: row.payable == "Yes",
                store: this.props.store
            }),
            { onFailure, onSuccess }
        );
    };

    render() {
        return (
            <div>
                <h1>Campaigns</h1>
                {this.getDataGrid()}
            </div>
        )
    }
}

export default CampaignsComponent;