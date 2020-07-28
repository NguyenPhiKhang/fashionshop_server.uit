const authResolver = require('./auth');
const permissionResolver = require('./permissions');
const categoryResolver = require('./category');
const attributeResolver = require('./attribute');
const optionResolver = require("./option");
const productResolver = require("./product");
const levelCategoriesResolver = require("./levelcategories");
const orderResolver = require("./order");
const cartResolver = require("./cart");
const personResolver = require("./person");
const reviewResolver = require("./review");

const rootResolver = {
  ...authResolver,
  ...permissionResolver,
  ...categoryResolver,
  ...attributeResolver,
  ...optionResolver,
  ...productResolver,
  ...levelCategoriesResolver,
  ...orderResolver,
  ...personResolver,
  ...cartResolver,
  ...reviewResolver,
};

module.exports = rootResolver;