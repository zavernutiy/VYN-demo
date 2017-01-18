import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid/addons';
import DateFormatter from '../DateGridFormatter/DateGridFormatter';
import EditMemberButton from '../EditMemberButton/EditMemberButton';
import EditMemberViewProfileButtons from '../EditMemberViewProfileButtons/EditMemberViewProfileButtons';
// import math helper because it adds round10 method to Math
import MathHelper from '../../../lib/mathHelper';
import json2csv from 'json2csv';
import RaisedButton from 'material-ui/RaisedButton';
import PaymentRequestInfoButton from '../PaymentRequestInfoButton/PaymentRequestInfoButton';

var Selectors = Data.Selectors;
var Filters = ReactDataGridPlugins.Filters;

import '../../../node_modules/react-data-grid/themes/react-data-grid.css'

class PaymentRequestsGridComponent extends React.Component {
    constructor(props) {
        super(props);
        let { totalAmount, totalAmountPaid, totalAmountNotPaid } = this.getTotalAmount();
        this.state = {
            rows: this.getOriginalRows(),
            filters: {},
            sortColumn: null,
            sortDirection: null,
            totalAmount,
            totalAmountPaid,
            totalAmountNotPaid,
            columns: [
                {
                    key: 'name',
                    name: 'Member',
                    filterable: true,
                    sortable: true
                },
                {
                    key: 'paypalEmail',
                    name: 'Paypal Email',
                    filterable: true,
                    sortable: true
                },
                {
                    key: "memberId",
                    name: "Member details",
                    formatter: EditMemberViewProfileButtons,
                    getRowMetaData: (row) => row.memberMongoId
                },
                {
                    key: 'blackList',
                    name: 'Black list',
                    sortable: true,
                    filterable: true
                },
                {
                    key: 'requestDate',
                    name: 'Request Date',
                    sortable: true,
                    formatter: DateFormatter
                },
                {
                    key: 'amount',
                    name: 'Amount',
                    sortable: true,
                    filterable: true,
                    filterRenderer: Filters.NumericFilter
                },
                {
                    key: 'wasPaid',
                    name: 'Was paid',
                    sortable: true,
                    filterable: true
                },
                {
                    key: 'reconciliationDate',
                    name: 'Reconciliation Date',
                    sortable: true,
                    formatter: DateFormatter
                },
                {
                    key: 'id',
                    name: 'Info',
                    sortable: true,
                    formatter: PaymentRequestInfoButton
                }
            ]
        }
    }

    getDataGrid = () => {
        return(
            <ReactDataGrid
                onGridSort={this.handleGridSort}
                columns={this.getColumns()}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}
                minHeight={700}
                toolbar={<Toolbar enableFilter={true}/>}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}
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
        this.setState({filters: {} });
    };

    getOriginalRows = () => {
        return this.props.store.paymentRequestConnection.edges.map((edge) => {
            return {
                id: edge.node.id,
                name: this.getName(edge.node),
                memberId: this.getMemberId(edge.node),
                memberMongoId: this.getMemberMongoId(edge.node),
                blackList: this.getMemberBlackListStatus(edge.node),
                requestDate: edge.node.requestDate,
                amount: this.getAmount(edge.node),
                currency: "EUR",
                paypalEmail: this.getMemberPaypalEmail(edge.node),
                wasPaid: edge.node.wasPaid ? "Yes" : "No",
                reconciliationDate: edge.node.reconciliationDate
            };
        });
    };

    getName = (node) => {
        if (!node.member) return "";
        return `${node.member.firstName} ${node.member.lastName}`;
    };

    getMemberId = (node) => {
        if (!node.member) return "";
        return node.member.id;
    };

    getMemberMongoId = (node) => {
        if (!node.member) return "";
        return node.member.mongoId;
    };

    getMemberBlackListStatus = (node) => {
        if (!node.member) return "";
        return node.member.blackListStatus ? "Yes" : "No";
    };

    getMemberPaypalEmail = (node) => {
        if (!node.member) return "";
        return node.member.paypalEmail;
    };

    getAmount = (node) => {
        if (node.posts && node.posts.length > 0) {
            let amount = 0;
            node.posts.forEach(post => {
                let clicks = post.clicks;
                if (post.campaign) {
                    let cpcPublisher = post.campaign.CPCPublisher;
                    let maxRevenue = post.campaign.maxRevenue;
                    if (post.campaign.payable) {
                        if (clicks * cpcPublisher > maxRevenue) {
                            amount += maxRevenue;
                        } else {
                            amount += clicks * cpcPublisher;
                        }
                    }
                }
            });
            return Math.round10(amount, -2);
        }
        return 0;
    };

    getTotalAmount = () => {
        let totalAmount = 0;
        let totalAmountPaid = 0;
        let totalAmountNotPaid = 0;

        this.props.store.paymentRequestConnection.edges.forEach((edge) => {
            let amount = this.getAmount(edge.node);
            totalAmount += amount;
            if (edge.node.wasPaid) {
                totalAmountPaid += amount;
            } else {
                totalAmountNotPaid += amount;
            }
        });

        return {
            totalAmount: Math.round10(totalAmount, -2),
            totalAmountPaid: Math.round10(totalAmountPaid, -2),
            totalAmountNotPaid: Math.round10(totalAmountNotPaid, -2)
        };
    };

    getTotalFilteredAmount = () => {
        let totalAmount = 0;
        let totalAmountPaid = 0;
        let totalAmountNotPaid = 0;

        let rows = Selectors.getRows(this.state);

        if (rows) {
            rows.forEach((row) => {
                totalAmount += row.amount;
                if (row.wasPaid == "Yes") {
                    totalAmountPaid += row.amount;
                } else {
                    totalAmountNotPaid += row.amount;
                }
            });
        }

        return {
            totalAmount: Math.round10(totalAmount, -2),
            totalAmountPaid: Math.round10(totalAmountPaid, -2),
            totalAmountNotPaid: Math.round10(totalAmountNotPaid, -2)
        };
    };

    exportToCsv = () => {
        const locale = "en-GB";
        const fields = [
            "paypalEmail",
            "amount",
            "currency",
            {
                label: "Request date",
                value: row => new Date(row.requestDate).toLocaleDateString(locale)
            },
            "name"
        ];
        const filename = "PaymentRequests.csv";
        const csv = json2csv({data: Selectors.getRows(this.state), fields: fields});
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

    render() {
        let { totalAmount, totalAmountPaid, totalAmountNotPaid } = this.getTotalFilteredAmount();
        return (
            <div>
                <h1>Payment Requests</h1>
                <p>Total amount {this.state.totalAmount}, paid {this.state.totalAmountPaid}, not paid {this.state.totalAmountNotPaid}</p>
                <p>Total filtered amount {totalAmount}, paid {totalAmountPaid}, not paid {totalAmountNotPaid}</p>
                <RaisedButton label="Export to csv" onClick={this.exportToCsv} />
                {this.getDataGrid()}
            </div>
        )
    }
}

export default PaymentRequestsGridComponent;