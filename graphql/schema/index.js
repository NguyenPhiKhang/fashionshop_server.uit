const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Account {
  _id: ID!
  email: String!
  password: String
  record_status: Boolean
}
type AuthData {
  accountId: ID!
  token: String!
  tokenExpiration: Int!
  permission: Permission!
}
type Permission{
  _id: ID!
  name: String!
  desc: String
}
type Category{
  _id: ID!
  category_code: Int!
  name: String!
  icon: String
  image: String
  level_cat: Int!
  parent: Category
}
type Attribute{
  _id: ID!
  attribute_code: Int!
  name: String!
  value: [Option]!
}
type Option{
  _id: ID!
  option_code: Int!
  name: String!
  attribute: Attribute!
  type_option: String
}
type RatingStar{
  _id: ID!
  star1: Int
  star2: Int
  star3: Int
  star4: Int
  star5: Int
  product_id: ID!
}
type Categories{
  _id: ID!
  category_level1_id: Int!
  category_level1_name: String!
  category_level2_id: Int!
  category_level2_name: String!
  category_level3_id: Int!
  category_level3_name: String!
  products: [Product]
}
type Product{
  _id: ID!
  product_code: Int!
  name: String!
  images: [String]
  price: Float!
  final_price: Float!
  promotion_percent: Float
  description: String!
  total_review: Int
  order_count: Int
  weight: Float
  short_description: String
  rating_star: RatingStar
  stock_status: Boolean!
  review: [Review]
  is_freeship: Boolean
  attribute: [Attribute_Option]!
  category_id: String
  categories: Categories
  record_status: Boolean!
}
type Review{
  _id: ID!
}
type Attribute_Option{
  _id: ID!
}
input AccountInput {
  email: String!
  password: String!
  permission_id: ID!
}
input PermissionInput{
  name: String!
  desc: String
}
input CategoryInput{
  name: String!
  icon: String
  image: String
  level_cat: Int!
  parent_id: String
}
input OptionInput{
  name: String!
  type_option: String
  attribute_id: ID!
}
input ProductInput{
  name: String!
  images: [String]
  price: Float!
  promotion_percent: Float
  description: String!
  weight: Float
  short_description: String
  stock_status: Boolean!
  is_freeship: Boolean
  attribute: [ID]!
  category_id: String
  categories: ID!
}
type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPermission: [Permission]!
    getIdPermission(name: String!): ID!
    getAllCategory: [Category]!
    getCategoryById(id: ID!): Category!
    getAttributeById(id: ID!): Attribute!
    getOptionByAttribute(attr_id: ID!, typeOption: String): [Option]!
}
type RootMutation {
    createAccount(accountInput: AccountInput): Account
    createPermission(permissionInput: PermissionInput): Permission
    createCategory(categoryInput: CategoryInput): Category
    createAttribute(name: String!): Attribute
    createOption(optionInput: OptionInput): Option
    createProduct(productInput: ProductInput): Product
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);