const authResolver = require('./auth');
const permissionResolver = require('./permissions');
const categoryResolver = require('./category');

const rootResolver = {
  ...authResolver,
  ...permissionResolver,
  ...categoryResolver
};

module.exports = rootResolver;