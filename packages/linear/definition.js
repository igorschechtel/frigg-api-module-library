require('dotenv').config();
const {Api} = require('./api');
const {Credential} = require('./models/credential');
const {Entity} = require('./models/entity');
const {get} = require("@friggframework/core");
const config = require('./defaultConfig.json')

const Definition = {
    API: Api,
    getName: function () {
        return config.name
    },
    moduleName: config.name,//maybe not required
    Credential,
    Entity,
    requiredAuthMethods: {
        getToken: async function (api, params) {
            const code = get(params.data, 'code');
            return api.getTokenFromCode(code);
        },
        getEntityDetails: async function (api, callbackParams, tokenResponse, userId) {
            const entityDetails = await api.getTokenIdentity();
            return {
                identifiers: {externalId: entityDetails.identifier, user: userId},
                details: {name: entityDetails.name},
            }
        },
        apiPropertiesToPersist: {
            credential: ['access_token'],
            entity: [],
        },
        getCredentialDetails: async function (api) {
            const userDetails = await api.getTokenIdentity();
            return {
                identifiers: {externalId: userDetails.identifier},
                details: {}
            };
        },
        testAuthRequest: async function (api) {
            return await api.getUser()
        },
    },
    env: {
        client_id: process.env.LINEAR_CLIENT_ID,
        client_secret: process.env.LINEAR_CLIENT_SECRET,
        redirect_uri: `${process.env.REDIRECT_URI}/linear`,
        scope: process.env.LINEAR_SCOPE,
    }
};

module.exports = {Definition};
