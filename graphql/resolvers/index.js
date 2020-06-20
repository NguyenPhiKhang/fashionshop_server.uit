const authResolver = require('./auth');
const permissionResolver = require('./permissions');

const rootResolver = {
  ...authResolver,
  ...permissionResolver
};

module.exports = rootResolver;