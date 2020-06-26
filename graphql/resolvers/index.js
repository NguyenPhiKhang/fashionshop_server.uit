const authResolver = require('./auth');
const permissionResolver = require('./permissions');
const categoryResolver = require('./category');
const attributeResolver = require('./attribute');
const optionResolver = require("./option");

const rootResolver = {
  ...authResolver,
  ...permissionResolver,
  ...categoryResolver,
  ...attributeResolver,
  ...optionResolver

};

module.exports = rootResolver;