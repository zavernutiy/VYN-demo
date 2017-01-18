/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLSchema,
    GraphQLString
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
} from 'graphql-relay';

import Parse from 'parse/node';
import DateHelper from '../lib/dateHelper';
import UserHelper from '../lib/userHelper';
import mongoDBHelper from '../lib/mongoDBHelper';
import { ObjectID } from 'mongodb';
import constants from '../lib/constants';
// import math helper because it adds round10 method to Math
import MathHelper from '../lib/mathHelper';

let ParseMember = Parse.Object.extend('Member');
let ParseCampaign = Parse.Object.extend('Campaign');
let ParseGroup = Parse.Object.extend('Group');
let ParseSocialNetwork = Parse.Object.extend('SocialNetwork');
let ParsePost = Parse.Object.extend('Post');
let ParsePaymentRequest = Parse.Object.extend('PaymentRequest');

class Store {}
let store = new Store();

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
let { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        var {type} = fromGlobalId(globalId);
        if (type === 'Store') {
            return store;
        } else {
            return null;
        }
    },
    (obj) => {
        if (obj instanceof Store) {
            return storeType;
        } else if (obj instanceof ParseMember) {
            return memberType;
        } else if (obj instanceof ParseGroup) {
            return groupType;
        } else if (obj instanceof ParseCampaign) {
            return campaignType;
        } else if (obj instanceof ParsePost) {
            return postType;
        } else if (obj instanceof ParsePaymentRequest) {
            return paymentRequestType;
        }   else {
            return null;
        }
    }
);

/**
 * GraphQL types
 */
let storeType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
        id: globalIdField('Store'),
        member: {
            type: memberType,
            args: {
                ...connectionArgs,
                id: { type: GraphQLString }
            },
            resolve: (_, args) => {
                let memberQuery = new Parse.Query(ParseMember);
                if (args.id) {
                    memberQuery.equalTo('objectId', args.id);
                }
                memberQuery.include('socialNetworks');
                // If parse user was found return parse user.
                // If error occurred return error
                return memberQuery.first().then(
                    member => member,
                    err => err
                );
            }
        },
        memberConnection: {
            type: memberConnection.connectionType,
            args: {
                ...connectionArgs,
                sortField: { type: GraphQLString },
                sortAscending: { type: GraphQLBoolean }
            },
            resolve: (_, args) => {
                let memberQuery = new Parse.Query(ParseMember);
                if (args.first) {
                    memberQuery.limit(args.first);
                }

                // args.sortField specifies the field that will be used for sorting
                // args.sortAscending is boolean value that specifies if sort is ascending or descending
                if (args.sortField && args.hasOwnProperty('sortAscending')) {
                    if (args.sortAscending) {
                        memberQuery.ascending(args.sortFeld);
                    } else {
                        memberQuery.descending(args.sortField);
                    }
                }

                memberQuery.include('socialNetworks');

                return connectionFromPromisedArray(
                    memberQuery.find().then(
                        (members) => {
                            return members;
                        }, (err) => {
                            console.log(err);
                        }),
                    args);
            }
        },
        campaignConnection: {
            type: campaignConnection.connectionType,
            args: {
                ...connectionArgs,
                sortField: { type: GraphQLString },
                sortAscending: { type: GraphQLBoolean }
            },
            resolve: (_, args) => {
                let campaignQuery = new Parse.Query(ParseCampaign);
                if (args.first) {
                    campaignQuery.limit(args.first);
                }

                // args.sortField specifies the field that will be used for sorting
                // args.sortAscending is boolean value that specifies if sort is ascending or descending
                if (args.sortField && args.hasOwnProperty('sortAscending')) {
                    if (args.sortAscending) {
                        campaignQuery.ascending(args.sortFeld);
                    } else {
                        campaignQuery.descending(args.sortField);
                    }
                }

                campaignQuery.include('user');
                campaignQuery.include('group.members');

                return connectionFromPromisedArray(
                    campaignQuery.find().then(
                        (campaigns) => {
                            return campaigns;
                        }, (err) => {
                            console.log(err);
                        }),
                    args);
            }
        },
        groupConnection: {
            type: groupConnection.connectionType,
            args: {
                ...connectionArgs,
                id: { type: GraphQLString },
                exceptType: { type: GraphQLInt }
            },
            resolve: (_, args) => {
                let groupQuery = new Parse.Query(ParseGroup);
                if (args.exceptType || args.exceptType == 0) {
                    groupQuery.notEqualTo("type", args.exceptType);
                }
                if (args.first) {
                    groupQuery.limit(args.first);
                }
                groupQuery.include("members");
                return connectionFromPromisedArray(
                    groupQuery.find().then(
                        groups => groups,
                        error => console.log(error)
                    ), args);
            }
        },
        group: {
            type: groupType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (_, args) => {
                let groupQuery = new Parse.Query(ParseGroup);
                if (args.id) {
                    groupQuery.equalTo("objectId", args.id);
                }
                groupQuery.include("members.socialNetworks");
                return groupQuery.first().then(
                    group => group,
                    error => {
                        console.log("Error, could not get group");
                        console.log(error);
                        return error;
                    }
                )
            }
        },
        paymentRequestConnection: {
            type: paymentRequestConnection.connectionType,
            /*args: {
                ...connectionArgs,
                id: { type: GraphQLString },
                exceptType: { type: GraphQLInt }
            },*/
            resolve: (_, args) => {
                let query = new Parse.Query(ParsePaymentRequest);
                query.limit(1000);
/*                if (args.exceptType || args.exceptType == 0) {
                    query.notEqualTo("type", args.exceptType);
                }
                if (args.first) {
                    query.limit(args.first);
                }*/
                query.include("posts.campaign");
                query.include("member");
                return connectionFromPromisedArray(
                    query.find().then(
                        paymentRequests => paymentRequests,
                        error => console.log(error)
                    ), args);
            }
        },
        paymentRequest: {
            type: paymentRequestType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (_, args) => {
                let paymentRequestQuery = new Parse.Query(ParsePaymentRequest);
                if (args.id) {
                    paymentRequestQuery.equalTo("objectId", args.id);
                }
                paymentRequestQuery.include("member");
                paymentRequestQuery.include("posts.campaign");
                return paymentRequestQuery.first().then(
                    paymentRequest => paymentRequest,
                    error => {
                        console.log("Error, could not get payment request");
                        console.log(error);
                        return error;
                    }
                )
            }
        },
    }),
    interfaces: [nodeInterface]
});

let memberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString)
            // no need to write resolve
        },
        firstName: {
            type: GraphQLString,
            // no need to write (obj) => obj.get('name')
            resolve: obj => obj.get('firstName') ? obj.get('firstName') : ''
        },
        lastName: {
            type: GraphQLString,
            resolve: obj => obj.get('lastName') ? obj.get('lastName') : ''
        },
        email: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('email')
        },
        website: {
            type: GraphQLString,
            resolve: obj => obj.get('website')
        },
        gender: {
            type: GraphQLString,
            resolve: obj => obj.get('gender')
        },
        country: {
            type: GraphQLString,
            resolve: obj => obj.get('country')
        },
        language: {
            type: GraphQLString,
            resolve: obj => obj.get('language')
        },
        publisherStatus: {
            type: GraphQLString,
            resolve: obj => obj.get('publisherStatus')
        },
        blackListStatus: {
            type: GraphQLBoolean,
            resolve: obj => obj.get('blackListStatus') ? true : false
        },
        mongoId: {
            type: GraphQLString,
            resolve: obj => obj.get('mongoId')
        },
        registrationDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('registrationDate'));
            }
        },
        lastConnectionDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('lastConnectionDate'));
            }
        },
        userSegment: {
            type: GraphQLInt,
            resolve: obj => obj.get('userSegment')
        },
        userInterests: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('userInterests')
        },
        socialNetworks: {
            type: new GraphQLList(socialNetworkType),
            resolve: obj => obj.get('socialNetworks')
        },
        qualified: {
            type: GraphQLBoolean,
            resolve: obj => obj.get('qualified')
        },
        paypalEmail: {
            type: GraphQLString,
            resolve: obj => obj.get("paypalEmail")
        }
    })
});

let socialNetworkType = new GraphQLObjectType({
    name: 'SocialNetwork',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        type: {
            type: GraphQLString,
            resolve: obj => obj.get('type')
        },
        providerId: {
            type: GraphQLString,
            resolve: obj => obj.get('providerId')
        },
        link: {
            type: GraphQLString,
            resolve: obj => obj.get('link')
        },
        audience: {
            type: GraphQLInt,
            resolve: obj => obj.get('audience')
        },
        userInterests: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('userInterests')
        },
        userSegment: {
            type: GraphQLInt,
            resolve: obj => obj.get('userSegment')
        }
    })
});

let socialNetworkInputType = new GraphQLInputObjectType({
    name: 'SocialNetworkInput',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        type: {
            type: GraphQLString,
            resolve: obj => obj.get('type')
        },
        providerId: {
            type: GraphQLString,
            resolve: obj => obj.get('providerId')
        },
        link: {
            type: GraphQLString,
            resolve: obj => obj.get('link')
        },
        audience: {
            type: GraphQLInt,
            resolve: obj => obj.get('audience')
        },
        userInterests: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('userInterests')
        },
        userSegment: {
            type: GraphQLInt,
            resolve: obj => obj.get('userSegment')
        }
    })
});

let campaignType = new GraphQLObjectType({
    name: 'Campaign',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        mongoId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: obj => obj.get('mongoId')
        },
        name: {
            type: GraphQLString,
            resolve: obj => obj.get('name')
        },
        customerName: {
            type: GraphQLString,
            resolve: obj => obj.get('customerName')
        },
        networks: {
            type: GraphQLString,
            resolve: obj => obj.get('networks')
        },
        userSegments: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('userSegments')
        },
        interests: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('interests')
        },
        CPCAdvertiser: {
            type: GraphQLFloat,
            resolve: obj => Math.round10(obj.get('CPCAdvertiser'), -2)
        },
        CPCPublisher: {
            type: GraphQLFloat,
            resolve: obj => Math.round10(obj.get('CPCPublisher'), -2)
        },
        maxRevenue: {
            type: GraphQLInt,
            resolve: obj => obj.get('maxRevenue')
        },
        totalBudget: {
            type: GraphQLInt,
            resolve: obj => obj.get('totalBudget')
        },
        status: {
            type: GraphQLInt,
            resolve: obj => obj.get('status')
        },
        // If emailSent value is undefined the object that has this value won't be in query
        emailSent: {
            type: GraphQLBoolean,
            resolve: (obj) => {
                if (obj.get('emailSent') == undefined) {
                    return false;
                }
                return obj.get('emailSent');
            }
        },
        userId: {
            type: GraphQLString,
            resolve: obj => obj.get('userId')
        },
        user: {
            type: memberType,
            resolve: obj => obj.get('user')
        },
        group: {
            type: groupType,
            resolve: obj => obj.get('group')
        },
        startDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('startDate'));
            }
        },
        endDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('endDate'));
            }
        },
        payable: {
            type: GraphQLBoolean,
            resolve: (obj) => {
                if (obj.get('payable') == undefined) {
                    return false;
                }
                return obj.get('payable');
            }
        },
    })
});

let groupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            type: GraphQLString,
            resolve: obj => obj.get('name')
        },
        type: {
            type: GraphQLString,
            resolve: obj => obj.get('type')
        },
        members: {
            type: new GraphQLList(memberType),
            resolve: obj => obj.get('members')
        },
        membersAmount: {
            type: GraphQLInt,
            resolve: obj => obj.get('members').length
        }
    })
});

let postType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        socialNetwork: {
            type: GraphQLString,
            resolve: obj => obj.get('socialNetwork')
        },
        redirectionUrl: {
            type: GraphQLString,
            resolve: obj => obj.get('redirectionUrl')
        },
        userId: {
            type: GraphQLString,
            resolve: obj => obj.get('userId')
        },
        paymentRequested: {
            type: GraphQLBoolean,
            resolve: obj => obj.get('paymentRequested') ? true : false
        },
        campaignId: {
            type: GraphQLString,
            resolve: obj => obj.get('campaignId')
        },
        mongoId: {
            type: GraphQLString,
            resolve: obj => obj.get('mongoId')
        },
        paidPublisher: {
            type: GraphQLBoolean,
            resolve: obj => obj.get('paidPublisher') ? true : false
        },
        campaign: {
            type: campaignType,
            resolve: obj => obj.get('campaign')
        },
        reconciliationDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('reconciliationDate'));
            }
        },
        socialNetworks: {
            type: new GraphQLList(socialNetworkType),
            resolve: obj => obj.get('socialNetworks')
        },
        token: {
            type: GraphQLString,
            resolve: obj => obj.get('token')
        },
        member: {
            type: memberType,
            resolve: obj => obj.get('member')
        },
        socialNetworkId: {
            type: GraphQLString,
            resolve: obj => obj.get('socialNetworkId')
        },
        posted: {
            type: GraphQLBoolean,
            resolve: obj => obj.get('posted') ? true : false
        },
        destinationUrl: {
            type: GraphQLString,
            resolve: obj => obj.get('destinationUrl')
        },
        clicks: {
            type: GraphQLInt,
            resolve: obj => obj.get('clicks')
        }
    })
});

let paymentRequestType = new GraphQLObjectType({
    name: 'PaymentRequest',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        userId: {
            type: GraphQLString,
            resolve: obj => obj.get('userId')
        },
        mongoId: {
            type: GraphQLString,
            resolve: obj => obj.get('mongoId')
        },
        member: {
            type: memberType,
            resolve: obj => obj.get('member')
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: obj => obj.get('posts')
        },
        subscriptionIds: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.get('subscriptionIds')
        },
        requestDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('requestDate'));
            }
        },
        wasPaid: {
            type: GraphQLBoolean,
            resolve: (obj) => obj.get("wasPaid") ? true : false
        },
        paypalEmail: {
            type: GraphQLString,
            resolve: (obj) => obj.get("paypalEmail")
        },
        reconciliationDate: {
            type: GraphQLFloat,
            resolve: (obj) => {
                return DateHelper.getDateUnixTimeStamp(obj.get('reconciliationDate'));
            }
        }
    })
});

/**
 * GraphQL connections
 */
let memberConnection = connectionDefinitions({
    name: 'Member',
    nodeType: memberType
});

let groupConnection = connectionDefinitions({
    name: 'Group',
    nodeType: groupType
});

let campaignConnection = connectionDefinitions({
    name: 'Campaign',
    nodeType: campaignType
});

let paymentRequestConnection = connectionDefinitions({
    name: 'PaymentRequest',
    nodeType: paymentRequestType
});

/**
 * GraphQL Mutations
 */
let editMemberMutation = mutationWithClientMutationId({
    name: 'EditMember',

    inputFields: {
        id: { type: GraphQLString },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLList(GraphQLString) },
        website: { type: GraphQLString },
        gender: { type: GraphQLString },
        country: { type: GraphQLString },
        language: { type: GraphQLString },
        interests: { type: new GraphQLList(GraphQLString) },
        mongoId: { type: GraphQLString },
        segment: { type: GraphQLInt },
        socialNetworks: { type: new GraphQLList(socialNetworkInputType) },
        blackListStatus: { type: GraphQLBoolean }
    },

    outputFields: {
        memberEdge: {
            type: memberConnection.edgeType,
            resolve: (obj) => ({ node: obj, cursor: obj.id })
        },
        store: {
            type: storeType,
            resolve: () => store
        }
    },

    mutateAndGetPayload: ({ id, firstName, lastName, email, website, gender, country, language, interests, mongoId, segment, socialNetworks, blackListStatus }) => {
        let parseSocialNetworks = [];
        if (socialNetworks) {
            socialNetworks.forEach(socialNetwork => {
                let parseSocialNetwork;
                if (socialNetwork.id) {
                    parseSocialNetwork = ParseSocialNetwork.createWithoutData(socialNetwork.id);
                } else {
                    parseSocialNetwork = new ParseSocialNetwork();
                }
                parseSocialNetwork.set("userInterests", socialNetwork.userInterests);
                parseSocialNetwork.set("userSegment", socialNetwork.userSegment);
                parseSocialNetworks.push(parseSocialNetwork);
            });
        }
        const db = mongoDBHelper.getDatabase();
        const UserDetail = db.collection("userdetail");
        return new Promise((resolve, reject) => {
            UserDetail.findOneAndUpdate({userId: new ObjectID(mongoId)}, {
                $set: {
                    interests: interests,
                    userSegment: segment,
                    gender: gender,
                    country: country,
                    language: language,
                    blacklisted: blackListStatus
                }
            }, (err, result) => {
                if (err) {
                    console.log('Error updating userdetail', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }).then((result) => {
            return Parse.Object.saveAll(parseSocialNetworks);
        }).then((result) => {
            if (id) {
                console.log('modify user');
                let memberQuery = new Parse.Query(ParseMember);
                memberQuery.equalTo('objectId', id);
                return memberQuery.first().then(
                    (member) => {
                        UserHelper.setMemberData({ member, firstName, lastName, email, website, gender, country, language, interests, segment, blackListStatus });
                        return member.save(null).then(
                            member => member,
                            error => error
                        );
                    }, (err) => err
                );
            } else {
                console.log('create user');
                let member = new ParseMember();
                UserHelper.setMemberData({ member, firstName, lastName, email, website, gender, country, language, interests, segment, blackListStatus });
                return member.save(null).then(
                    member => member,
                    error => error
                );
            }
        });

    }
});

let createEditGroupMutation = mutationWithClientMutationId({
    name: 'CreateEditGroup',

    inputFields: {
        groupId: { type: GraphQLString },
        name: { type: GraphQLString },
        type: { type: GraphQLInt },
        memberIds: { type: new GraphQLList(GraphQLString) },
        memberMongoIds: { type: new GraphQLList(GraphQLString) }
    },

    outputFields: {
        groupEdge: {
            type: groupConnection.edgeType,
            resolve: (obj) => ({ node: obj, cursor: obj.id })
        },
        store: {
            type: storeType,
            resolve: () => store
        }
    },

    mutateAndGetPayload: ({ groupId, name, type, memberIds, memberMongoIds }) => {
        if (groupId) {
            let groupQuery = new Parse.Query(ParseGroup);
            groupQuery.equalTo("objectId", groupId);
            return groupQuery.first().then(
                (group) => {
                    group.set("name", name);
                    group.set("type", type);
                    if (memberIds) {
                        memberIds.forEach(memberId => group.addUnique("members", Parse.Object.createWithoutData(memberId)));
                    }

                    return group.save();
                }, (error) => {
                    console.log("Error, cannot find group with id", groupId);
                    console.log(error);
                }
            ).then(
                (group) => {
                    if (type != constants.groupTypes.campaignGroup) {
                        return group;
                    } else {
                        let campaignQuery = new Parse.Query(ParseCampaign);
                        campaignQuery.equalTo("group", ParseGroup.createWithoutData(groupId));
                        return campaignQuery.first().then(
                            (campaign) => {
                                const campaignId = campaign.get("mongoId");
                                const db = mongoDBHelper.getDatabase();
                                const Campaign = db.collection("campaign");
                                return new Promise((resolve, reject) => {
                                    Campaign.findOneAndUpdate({_id: new ObjectID(campaignId)}, {
                                        $addToSet: {
                                            subscribersUserIds: { $each : memberMongoIds }
                                        }
                                    }, (err, result) => {
                                        if (err) {
                                            console.log('Error updating campaign');
                                            console.log(err);
                                            reject(err);
                                        } else {
                                            resolve(group);
                                        }
                                    });
                                }).then(result => {
                                    if (memberMongoIds) {
                                        memberMongoIds.forEach(mongoId => {
                                            campaign.addUnique("subscribersUserIds", mongoId);
                                        });
                                    }
                                    return campaign.save().then(
                                        campaign => {
                                            return group;
                                        },
                                        err => err
                                    )
                                }).catch((err) => {
                                    return err;
                                });
                            }, (err) => {
                                console.log("Error, could not find campaign related to group with id " + groupId);
                                console.log(err);
                            }
                        );
                    }
                }, (err) => {
                    console.log("Error, cannot save group with id", groupId);
                    console.log(error);
                }
            );
        } else {
            let group = new ParseGroup();
            group.set("name", name);
            group.set("type", type);
            if (memberIds) {
                group.set("members", memberIds.map(memberId => Parse.Object.createWithoutData(memberId)));
            }
            return group.save().then(
                group => group,
                error => {
                    console.log("Error, cannot save new group");
                    console.log(error);
                }
            )
        }
    }
});

let editPaymentRequestMutation = mutationWithClientMutationId({
    name: 'PaymentRequest',

    inputFields: {
        id: { type: GraphQLString }
    },

    outputFields: {
        paymentRequestEdge: {
            type: paymentRequestConnection.edgeType,
            resolve: (obj) => ({ node: obj, cursor: obj.id })
        },
        store: {
            type: storeType,
            resolve: () => store
        }
    },

    mutateAndGetPayload: ({ id }) => {
        let query = new Parse.Query(ParsePaymentRequest);
        query.equalTo("objectId", id);
        query.include("posts.campaign");
        let reconciliationDate = new Date();
        return query.first().then(
            paymentRequest => {
                const db = mongoDBHelper.getDatabase();
                const Subscription = db.collection("subscription");
                let posts = paymentRequest.get("posts");
                let newMongoIds = [];
                if (posts) {
                    posts.forEach(post => {
                        let campaign = post.get("campaign");
                        if (campaign) {
                            if (campaign.get("payable")) {
                                let mongoId = post.get("mongoId");
                                if (mongoId) {
                                    newMongoIds.push(new ObjectID(mongoId));
                                }
                            }
                        }
                    });
                }
                let mongoIds = paymentRequest.get("subscriptionIds") ? paymentRequest.get("subscriptionIds").map(id => new ObjectID(id)) : [];
                return new Promise((resolve, reject) => {
                    Subscription.updateMany(
                        { '_id' : { $in: newMongoIds } },
                        {
                            $set : {
                                paymentRequested: false,
                                paidPublisher: true,
                                reconciliationDate: reconciliationDate.getTime()
                            }
                        }, (err, result) => {
                            if (err) {
                                console.log('Error updating subscriptions', err);
                                reject(err);
                            } else {
                                resolve(paymentRequest);
                            }
                        }
                    );
                });
            }, error => {
                console.log("Cannot find payment request with", id);
                console.log(error);
            }
        ).then(
            paymentRequest => {
                paymentRequest.set("wasPaid", true);
                paymentRequest.set("reconciliationDate", reconciliationDate);
                let posts = paymentRequest.get("posts");
                if (posts) {
                    posts.forEach(post => {
                        let campaign = post.get("campaign");
                        if (campaign) {
                            if (campaign.get("payable")) {
                                post.set("paymentRequested", false);
                                post.set("paidPublisher", true);
                                post.set("reconciliationDate", reconciliationDate);
                            }
                        }
                    });
                }
                return Parse.Object.saveAll(posts).then(
                    posts => {
                        return paymentRequest.save();
                    }, error => {
                        console.log("Cannot save posts of payment request", id);
                        console.log(error);
                    }
                );
            }
        ).then(
            paymentRequest => paymentRequest,
            err => {
                console.log("Cannot save payment request", id);
                console.log(err);
            }
        );
    }
});

let editCampaignMutation = mutationWithClientMutationId({
    name: 'EditCampaign',

    inputFields: {
        id: { type: GraphQLString },
        status: { type: GraphQLInt },
        payable: { type: GraphQLBoolean }
    },

    outputFields: {
        campaignEdge: {
            type: campaignConnection.edgeType,
            resolve: (obj) => ({ node: obj, cursor: obj.id })
        },
        store: {
            type: storeType,
            resolve: () => store
        }
    },

    mutateAndGetPayload: ({ id, status, payable }) => {
        let query = new Parse.Query(ParseCampaign);
        query.equalTo("objectId", id);
        // Include group for returning campaign with group object.
        // Otherwise the mutation shows an error
        query.include("group");
        return query.first().then(
            campaign => {
                const campaignId = campaign.get("mongoId");
                const db = mongoDBHelper.getDatabase();
                const Campaign = db.collection("campaign");
                return new Promise((resolve, reject) => {
                    Campaign.findOneAndUpdate({_id: new ObjectID(campaignId)}, {
                        $set : {
                            status: status,
                            payable: payable
                        }
                    }, (err, result) => {
                        if (err) {
                            console.log('Error updating campaign');
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(campaign);
                        }
                    });
                });
            }, err => {
                console.log("Cannot find campaign with id", id);
                console.log(err);
            }
        ).then(
            campaign => {
                campaign.set("status", status);
                campaign.set("payable", payable);
                return campaign.save();
            }, err => err
        ).then(
            campaign => campaign,
            err => {
                console.log("Cannot save campaign with id", id);
                console.log(err);
            }
        );
    }
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        store: {
            type: storeType,
            resolve: () => store,
        },
    }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        // Add your own mutations here
        editMember: editMemberMutation,
        createEditGroup: createEditGroupMutation,
        editPaymentRequest: editPaymentRequestMutation,
        editCampaign: editCampaignMutation
    })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
    query: queryType,
    // Uncomment the following after adding some mutation fields:
    mutation: mutationType
});
