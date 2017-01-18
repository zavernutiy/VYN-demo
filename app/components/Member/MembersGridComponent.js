import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid/addons';
var Filters = ReactDataGridPlugins.Filters;
var Selectors = Data.Selectors;
// Using aliases because of Toolbar name collision
import { Toolbar as MaterialToolbar, ToolbarGroup as MaterialToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';
import RowsCount from '../RowsCount/RowsCountComponent';
import EditMemberButton from '../EditMemberButton/EditMemberButton';
import SendMessageToMemberButton from '../SendMessageToMemberButton/SendMessageToMemberButton';
import ExportToGroup from '../ExportToGroup/ExportToGroupContainer';
import DateFormatter from '../DateGridFormatter/DateGridFormatter';
import DialogWithTextArea from '../DialogWithTextArea/DialogWithTextArea';
import EditMemberViewProfileButtons from '../EditMemberViewProfileButtons/EditMemberViewProfileButtons';
import interests from '../../../lib/interests';
import json2csv from 'json2csv';
import 'jquery-ui-bundle'

import styles from './Members.scss';

class Members extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        if (props.groupId) {
            props.relay.setVariables({groupId: props.groupId});
        }
        this.state = {
            showGroupDialog: false,
            showCampaignDialog: false,
            showMessageDialog: false,
            facebookMessage: "",
            rowsCount: this.getOriginalRows().length,
            rows: this.getOriginalRows(),
            filters: {},
            sortColumn: null,
            sortDirection: null,
            index: 0,
            groupId: this.props.groupId,
            columns: [
                // 0 index is table for Audience
                [
                    {
                        key: 'name',
                        name: 'Name',
                        sortable: true,
                        filterable: true,
                        width: 200
                    },
                    {
                        key: 'email',
                        name: 'Emails',
                        sortable: true,
                        filterable: true,
                        width: 200
                    },
                    {
                        key: 'fbSendMessageLink',
                        name: 'Send Message',
                        formatter: SendMessageToMemberButton,
                        width: 180
                    },
                    {
                        key: 'fbMainPageAudience',
                        name: 'FB Main Account',
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.NumericFilter,
                        width: 180
                    },
                    {
                        key: 'fbPagesAudience',
                        name: 'FB Pages',
                        sortable: true,
                        filterable: true,

                        width: 160
                    },
                    {
                        key: 'fbPagesMaxAudience',
                        name: 'FB Page Max',
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.NumericFilter,
                        width: 180
                    },
                    {
                        key: 'LinkedInAudience',
                        name: 'LinkedIn',
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.NumericFilter,
                        width: 150
                    },
                    {
                        key: 'twitterAudience',
                        name: 'Twitter',
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.NumericFilter,
                        width: 140
                    },
                    {
                        key: 'instagramAudience',
                        name: 'Instagram',
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.NumericFilter,
                        width: 160
                    },
                    {
                        key: 'userSegment',
                        name: 'Segments',
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.NumericFilter,
                        width: 140
                    },
                    {
                        key: "userInterests",
                        name: "Interests",
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.AutoCompleteFilter,
                        width: 200
                    },
                    {
                        key: "gender",
                        name: "Gender",
                        sortable: true,
                        filterable: true,
                        filterRenderer: Filters.AutoCompleteFilter,
                        width: 100
                    },
                    {
                        key: "country",
                        name: "Country",
                        sortable: true,
                        filterable: true,
                        width: 80
                    },
                    {
                        key: "language",
                        name: "Language",
                        sortable: true,
                        filterable: true,
                        width: 80
                    },
                    {
                        key: "qualified",
                        name: "Qualified",
                        filterable: true,
                        sortable: true,
                        width: 80
                    },
                    {
                        key: "id",
                        name: "Edit",
                        formatter: EditMemberButton,
                        width: 60
                    }
                ],
                // 1 index table for Account
                [
                    {
                        key: 'name',
                        name: 'Name',
                        sortable: true,
                        filterable: true,
                        width: 200
                    },
                    {
                        key: 'email',
                        name: 'Emails',
                        sortable: true,
                        filterable: true,
                        width: 200
                    },
                    {
                        key: 'userSegment',
                        name: 'Segments',
                        sortable: true,
                        filterable:true
                    },
                    {
                        key: 'fbMainPageLink',
                        name: 'Facebook account',
                        sortable: true
                    },
                    {
                        key: 'fbPagesLink',
                        name: 'Facebook pages',
                        sortable: true
                    },
                    {
                        key: 'LinkedInLink',
                        name: 'LinkedIn',
                        sortable: true
                    },
                    {
                        key: 'twitterLink',
                        name: 'Twitter',
                        sortable: true
                    },
                    {
                        key: 'instagramLink',
                        name: 'Instagram',
                        sortable: true
                    },
                    {
                        key: "id",
                        name: "Edit",
                        formatter: EditMemberViewProfileButtons,
                        getRowMetaData: (row) => row.mongoId
                    },
                ],
                // 2 index table for Statuses
                [
                    {
                        key: 'name',
                        name: 'Name',
                        sortable: true,
                        filterable: true,
                    },
                    {
                        key: 'email',
                        name: 'Emails',
                        sortable: true,
                        filterable: true,
                    },
                    {
                        key: 'registrationDate',
                        name: 'Registration',
                        formatter: DateFormatter,
                        sortable: true,
                        width: 100
                    },
                    {
                        key: 'lastConnectionDate',
                        name: 'Last connection',
                        formatter: DateFormatter,
                        sortable: true,
                        width: 130
                    },
                    {
                        key: 'publisherStatus',
                        name: 'Publisher status',
                        sortable: true,
                        width: 130
                    },
                    {
                        key: 'blackList',
                        name: 'Black list',
                        sortable: true,
                        width: 100
                    },
                    {
                        key: "id",
                        name: "Edit",
                        formatter: EditMemberButton,
                        width: 60
                    }
                ],
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
                getValidFilterValues={this.getValidFilterValues}
            />
        )
    };

    getColumns = () => {
        return this.state.columns[this.state.index];
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
        // Create a copy of state object with new filters
        let newState = Object.assign({}, this.state, {filters: newFilters});
        this.setState({
            filters: newFilters,
            // Calculate rows count with new filter
            rowsCount: Selectors.getRows(newState).length
        });
    };

    onClearFilters = () => {
        //all filters removed
        let newState = Object.assign({}, this.state, {filters: {}});
        this.setState({
            filters: {},
            // Calculate rows count with all filters removed
            rowsCount: Selectors.getRows(newState).length
        });
    };

    /**
     * Gets all rows from relay store
     * @param joinArray
     * @returns {*}
     */
    getOriginalRows = (joinArray) => {
        if (this.props.groupId) {
            return this.props.store.group.members.map(member => {
                return this.getRowDataFromNode(member);
            });
        } else {
            return this.props.store.memberConnection.edges.map((edge) => {
                return this.getRowDataFromNode(edge.node);
            });
        }
    };

    getRowDataFromNode = (node) => {

        //console.log("node.socialNetworks",node.socialNetworks);


        let { fbMainPageAudience, fbSendMessageLink,fbPagesAudience, fbPagesMaxAudience,
            fbMainPageLink, fbPagesLink, twitterAudience,
            twitterLink, linkedInAudience, linkedInLink,
            instagramAudience, instagramLink, fbMainPageLinkArray,
            fbPagesLinkArray, twitterLinkArray, linkedInLinkArray,
            instagramLinkArray } = this.getSocialNetworkInfo(node.socialNetworks);
        return {
            id: node.id,
            mongoId: node.mongoId,
            firstName: node.firstName,
            lastName: node.lastName,
            name: `${node.firstName} ${node.lastName}`,

            // emails are returned in array.
            // If there are more than one email separate emails by coma
            email: node.email ? node.email.join(", ") : "",
            emailArray: node.email,
            registrationDate: node.registrationDate,
            lastConnectionDate: node.lastConnectionDate,
            publisherStatus: node.publisherStatus,
            userSegment: node.userSegment,
            userInterests: node.userInterests ? node.userInterests.join(", ") : "",
            userInterestsArray: node.userInterests,
            qualified: node.qualified ? "Yes" : "No",
            blackList: node.blackListStatus ? "Yes" : "No",

            //demographic value
            country : node.country ? node.country : "",
            gender: node.gender ? node.gender : "",
            language: node.language ? node.language : "",

            // social network values
            fbMainPageAudience,
            fbPagesAudience,
            fbPagesMaxAudience,
            fbMainPageLink,
            fbSendMessageLink,
            fbPagesLink,
            twitterAudience,
            twitterLink,
            LinkedInAudience: linkedInAudience,
            LinkedInLink: linkedInLink,
            instagramAudience,
            instagramLink,
            fbMainPageLinkArray,
            fbPagesLinkArray,
            twitterLinkArray,
            linkedInLinkArray,
            instagramLinkArray
        }
    };

    getSocialNetworkInfo = (socialNetworks) => {
        if (!socialNetworks) return {};

        let fbMainPageAudience = 0,
            fbPagesAudience = 0,
            fbPagesMaxAudience = 0,
            twitterAudience = 0,
            linkedInAudience = 0,
            instagramAudience = 0;

        let fbMainPageLink = '',
            fbSendMessageLink ='',
            fbMainPageLinkArray = [],
            fbPagesLink = '',
            fbPagesLinkArray = [],
            twitterLink = '',
            twitterLinkArray = [],
            linkedInLink = '',
            linkedInLinkArray = [],
            instagramLink = '',
            instagramLinkArray = [];

        socialNetworks.forEach(function (socialNetwork) {
            if (socialNetwork.type == 'facebook') {
                fbMainPageAudience += socialNetwork.audience;
                fbSendMessageLink = "https://www.facebook.com/"+socialNetwork.providerId;
                fbMainPageLink += ` ${socialNetwork.link}`;
                fbMainPageLinkArray.push(socialNetwork.link);
            } else if (socialNetwork.type == 'facebookPage') {
                fbPagesAudience += socialNetwork.audience;
                fbPagesMaxAudience = fbPagesMaxAudience > socialNetwork.audience ? fbPagesMaxAudience : socialNetwork.audience;
                fbPagesLink += ` ${socialNetwork.link}`;
                fbPagesLinkArray.push(socialNetwork.link);
            } else if (socialNetwork.type == 'twitter') {
                twitterAudience += socialNetwork.audience;
                twitterLink += ` ${socialNetwork.link}`;
                twitterLinkArray.push(socialNetwork.link);
            } else if (socialNetwork.type == 'linkedin') {
                linkedInAudience += socialNetwork.audience;
                linkedInLink += ` ${socialNetwork.link}`;
                linkedInLinkArray.push(socialNetwork.link);
            } else if (socialNetwork.type == 'instagram') {
                instagramAudience += socialNetwork.audience;
                instagramLink += ` ${socialNetwork.link}`;
                instagramLinkArray.push(socialNetwork.link);
            }
        });

        fbPagesLink = this.trimAndAddComma(fbPagesLink);

        fbMainPageLink = this.trimAndAddComma(fbMainPageLink);
        twitterLink = this.trimAndAddComma(twitterLink);
        linkedInLink = this.trimAndAddComma(linkedInLink);
        instagramLink = this.trimAndAddComma(instagramLink);

        return {
            fbMainPageAudience,
            fbPagesAudience,
            fbPagesMaxAudience,
            twitterAudience,
            linkedInAudience,
            instagramAudience,
            fbMainPageLink,
            fbSendMessageLink,
            fbMainPageLinkArray,
            fbPagesLink,
            fbPagesLinkArray,
            twitterLink,
            twitterLinkArray,
            linkedInLink,
            linkedInLinkArray,
            instagramLink,
            instagramLinkArray
        }
    };

    trimAndAddComma = (string) => {
        return string.trim().replace(" ", ", ");
    };

    handleChange = (event, index, value) => {
        this.setState({index});
    };

    showGroupDialog = (event) => {
        // console.log("Export to group clicked");
        // console.log(Selectors.getRows(this.state));
        this.setState({showGroupDialog: true});
    };

    closeGroupDialog = () => {
        this.setState({showGroupDialog: false});
    };

    submitGroupDialog = () => {
        this.setState({showGroupDialog: false});
    };

    showCampaignDialog = (event) => {
        this.setState({showCampaignDialog: true});
    };

    closeCampaignDialog = () => {
        this.setState({showCampaignDialog: false});
    };

    submitCampaignDialog = () => {
        this.setState({showCampaignDialog: false});
    };

    getMemberIds = () => {
        return Selectors.getRows(this.state).map(row => {
            return row.id;
        });
    };

    getMemberMongoIds = () => {
        return Selectors.getRows(this.state).map(row => {
            return row.mongoId;
        });
    };

    exportToCsv = () => {
        const locale = "en-GB";
        const fields = [
            "id",
            "mongoId",
            "firstName",
            "lastName",
            "name",
            "email",
            {
                label: "Registration date",
                value: row => new Date(row.registrationDate).toLocaleDateString(locale)
            },
            {
                label: "Last connection date",
                value: row => new Date(row.lastConnectionDate).toLocaleDateString(locale)
            },
            "publisherStatus",
            "userSegment",
            "userInterests",
            "qualified",
            "country",
            "gender",
            "language",
            "fbMainPageAudience",
            "fbSendMessageLink",
            "fbPagesAudience",
            "fbPagesMaxAudience",
            "fbMainPageLink",
            "fbPagesLink",
            "twitterAudience",
            "twitterLink",
            "LinkedInAudience",
            "LinkedInLink",
            "instagramAudience",
            "instagramLink"
        ];
        const filename = "Members.csv";
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

    exportToJson = () => {
        let data = Selectors.getRows(this.state);
        let jsonData = [];
        if (data) {
            jsonData = data.map(row => {
                return JSON.stringify(row);
            })
        }
        const filename = "Members.json";
        var blob = new Blob([jsonData], { type: 'text/json;charset=utf-8;' });
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

    facebookMessageChange = (facebookMessage) => {
        this.setState({facebookMessage});
    };

    openFacebookMessageDialog = () => {
        // for the moment, we will only open new tabs
        //this.setState({showMessageDialog: true});
        let values = [];
        let data = Selectors.getRows(this.state);
        for(var i = 0; i < data.length; i++) {
            var row = data[i];
            var link = row["fbSendMessageLink"];

            console.log("link is ",link);
            if (link!="" && link)
                values.push(link);



        }

        console.log("values are",values);
        if(values.length>30){

            window.alert('too many values')

        }
        else{

            console.log("should open");

            for(var i = 0; i < values.length; i++) {
                var value = values[i];
                console.log("should open ",value);
                window.open(value);

            }

        }





    };

    closeFacebookMessageDialog = () => {
        this.setState({showMessageDialog: false});
    };

    // TODO: Write the method to send message to facebook users
    submitFacebookMessageDialog = () => {
        this.closeFacebookMessageDialog();
    };

    getValidFilterValues = (columnId) => {
        let values = this.state.rows.map(r => r[columnId]);
        if (columnId == "userInterests") {
            return interests.interests;
        }
        return values.filter((item, i, a) => { return i == a.indexOf(item); });
    };

    render() {
        return (
            <div>
                <MaterialToolbar>
                    <MaterialToolbarGroup firstChild={true}>
                        <DropDownMenu value={this.state.index} onChange={this.handleChange}>
                            <MenuItem value={0} primaryText="Audience" />
                            <MenuItem value={1} primaryText="Account" />
                            <MenuItem value={2} primaryText="Statuses" />
                        </DropDownMenu>
                    </MaterialToolbarGroup>
                    <MaterialToolbarGroup>
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}} >
                            <MenuItem primaryText="Export to group" onClick={this.showGroupDialog} />
                            <MenuItem primaryText="Export to campaign" onClick={this.showCampaignDialog} />
                            <MenuItem primaryText="Export to csv" onClick={this.exportToCsv} />
                            <MenuItem primaryText="Export to json" onClick={this.exportToJson} />
                            <Divider />
                            <MenuItem
                                primaryText="Send email"
                                leftIcon={<ArrowDropRight className={styles.rotate180} />}
                                menuItems={[
                                    <MenuItem primaryText="Welcome email" />,
                                    <MenuItem primaryText="Copy" />,
                                    <Divider />,
                                    <MenuItem primaryText="Paste" />,
                                ]}
                            />
                            <MenuItem primaryText="Send Facebook message" onClick={this.openFacebookMessageDialog} />
                        </IconMenu>
                    </MaterialToolbarGroup>
                </MaterialToolbar>
                <h1>Members</h1>
                <RowsCount count={this.state.rowsCount} />
                {this.getDataGrid()}
                <ExportToGroup
                    store={this.props.store}
                    type={-1}
                    memberIds={this.getMemberIds()}
                    memberMongoIds={this.getMemberMongoIds()}
                    showGroupDialog={this.state.showGroupDialog}
                    closeGroupDialog={this.closeGroupDialog}
                    submitGroupDialog={this.submitGroupDialog} />
                <ExportToGroup
                    store={this.props.store}
                    type={0}
                    memberIds={this.getMemberIds()}
                    memberMongoIds={this.getMemberMongoIds()}
                    showGroupDialog={this.state.showCampaignDialog}
                    closeGroupDialog={this.closeCampaignDialog}
                    submitGroupDialog={this.submitCampaignDialog} />
                <DialogWithTextArea
                    title="Facebook message"
                    message={this.state.facebookMessage}
                    messageChange={this.facebookMessageChange}
                    showDialog={this.state.showMessageDialog}
                    closeDialog={this.closeFacebookMessageDialog}
                    submitDialog={this.submitFacebookMessageDialog}
                />
            </div>
        );
    }
}

export default Members;