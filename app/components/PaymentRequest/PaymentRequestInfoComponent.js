import React from 'react';
import Relay from 'react-relay';
import ToggleWithLabel from '../Form/ToggleWithLabelFormComponent';
import RaisedButton from 'material-ui/RaisedButton';
import PaymentRequestMutation from './PaymentRequestMutation';
import LabelInfoList from '../LabelInfo/LabelInfoList';
import styles from './PaymentRequestInfo.scss';
// import math helper because it adds round10 method to Math
import MathHelper from '../../../lib/mathHelper';

class PaymentRequestInfoComponent extends React.Component {
    /**
     * Require router to have possibility to navigate from component
     * */
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            wasPaid: this.props.store.paymentRequest.wasPaid
        };
    }

    wasPaidToggle = (wasPaid) => {
        this.setState({wasPaid});
    };

    submitForm = (e) => {
        /*
        * subscription[config.database.paymentRequested] = false;
        * subscription[config.database.paidPublisher] = true;
        * subscription[config.database.reconciliationDate] = new Date().getTime();
        * */
        e.preventDefault();

        // If wasPaid status was not changed just go back
        if (this.props.store.paymentRequest.wasPaid == this.state.wasPaid) {
            return this.goBack();
        }

        let onFailure = (transaction) => {
            var error = transaction.getError() || new Error('Mutation failed.');
            console.error(error);
        };
        let onSuccess = () => {
            console.log("Mutation success");
            this.goBack();
        };
        Relay.Store.commitUpdate(
            new PaymentRequestMutation({
                id: this.props.id,
                store: this.props.store
            }),
            { onFailure, onSuccess }
        );
    };

    goBack = () => {
        this.context.router.goBack();
    };

    getList = () => {
        let campaigns = {};
        let list = [];
        let posts = this.props.store.paymentRequest.posts;
        if (posts) {
            posts.forEach(post => {
                let clicks = post.clicks;
                if (post.campaign) {
                    let cpcPublisher = post.campaign.CPCPublisher;
                    let maxRevenue = post.campaign.maxRevenue;
                    let campaignId = post.campaign.id;
                    let campaignName = post.campaign.customerName;
                    let info = 0;
                    if (post.campaign.payable) {
                        if (clicks * cpcPublisher > maxRevenue) {
                            info = maxRevenue;
                        } else {
                            info = clicks * cpcPublisher;
                        }
                        if (!campaigns.hasOwnProperty(campaignId)) {
                            campaigns[campaignId] = {
                                name: campaignName,
                                revenues: [{
                                    clicks,
                                    cpcPublisher,
                                    maxRevenue,
                                    revenue: Math.round10(info, -2)
                                }]
                            }
                        } else {
                            campaigns[campaignId].revenues.push({
                                clicks,
                                cpcPublisher,
                                maxRevenue,
                                revenue: Math.round10(info, -2)
                            });
                        }
                    }
                }
                /*return {
                    label: post.campaign.customerName,
                    info: `${Math.round10(info, -2)} = ${clicks} * ${cpcPublisher} (max revenue ${maxRevenue})`
                }*/
            });
            // console.log("campaigns", campaigns);

            for (let key in campaigns) {
                if (campaigns.hasOwnProperty(key)) {
                    if (campaigns[key].revenues.length > 1) {
                        let amount = 0;
                        campaigns[key].revenues.forEach(revenue => {
                            amount += revenue.revenue;
                        });
                        list.push({
                            label: campaigns[key].name,
                            info: `${Math.round10(amount, -2)} total`
                        });
                        campaigns[key].revenues.forEach(revenue => {
                            list.push({
                                label: "",
                                info: `${revenue.revenue} = ${revenue.clicks} * ${revenue.cpcPublisher} (max revenue ${revenue.maxRevenue})`
                            });
                        });
                    } else {
                        let revenue = campaigns[key].revenues[0];
                        list.push({
                            label: campaigns[key].name,
                            info: `${revenue.revenue} = ${revenue.clicks} * ${revenue.cpcPublisher} (max revenue ${revenue.maxRevenue})`
                        });
                    }
                }
            }
            return list;
        }
        return [];
    };

    render() {
        return (
            <div>
                <h1>Payment request information</h1>
                <form onSubmit={this.submitForm} className={styles.paymentRequestForm}>
                    <ToggleWithLabel title="Was paid" toggled={this.state.wasPaid} onToggle={this.wasPaidToggle} disableToggled={true}/>
                    <LabelInfoList list={this.getList()}/>
                    <RaisedButton type="submit" label="Submit"/>
                </form>
            </div>
        );
    }
}

export default PaymentRequestInfoComponent;