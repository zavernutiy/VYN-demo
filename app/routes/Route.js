import React from 'react';
import {Route, Redirect} from 'react-router';

import StoreQuery from './StoreQuery';
import AppContainer from '../components/App/AppContainer';
import MembersContainer from '../components/Member/MembersGridContainer';
import EditMemberContainer from '../components/Member/EditMemberContainer';
import CreateEditUserContainer from '../components/CreateEditUser/CreateEditUserContainer';
import RecruitsContainer from '../components/Recruit/RecruitsGridContainer';
import CreateRecruitContainer from '../components/Recruit/CreateRecruitContainer';
import CampaignsContainer from '../components/Campaign/CampaignsGridContainer';
import PaymentRequestsContainer from '../components/PaymentRequest/PaymentRequestsGridContainer';
import PaymentRequestInfoContainer from '../components/PaymentRequest/PaymentRequestInfoContainer';

export default (
    <Route path='/' component={AppContainer} queries={StoreQuery}>
        <Route path='/members' component={MembersContainer} queries={StoreQuery}/>
        <Route path='/members/:groupId' component={MembersContainer} queries={StoreQuery}/>
        {/*<Route path='/members/edit/:id' component={CreateEditUserContainer} queries={StoreQuery} />*/}
        <Route path='/members/edit/:id' component={EditMemberContainer} queries={StoreQuery}/>
        <Route path='/recruits' component={RecruitsContainer} queries={StoreQuery}/>
        <Route path='/recruits/create' component={CreateRecruitContainer} queries={StoreQuery}/>
        <Route path='/campaigns' component={CampaignsContainer} queries={StoreQuery}/>
        <Route path='/paymentrequests' component={PaymentRequestsContainer} queries={StoreQuery}/>
        <Route path='/paymentrequest/info/:id' component={PaymentRequestInfoContainer} queries={StoreQuery}/>
        <Redirect from='*' to='/members'/>
    </Route>
);