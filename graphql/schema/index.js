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
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);