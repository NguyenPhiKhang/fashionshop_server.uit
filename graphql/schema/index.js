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
  icon: String!
  level_cat: Int!
  parent_code: Int
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
  level_cat: Int!
  parent_id: Int
}
type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPermission: [Permission]!
    getIdPermission(name: String!): ID!
    getAllCategory: [Category]!
    getCategoryById(id: ID!): Category!
}
type RootMutation {
    createAccount(accountInput: AccountInput): Account
    createPermission(permissionInput: PermissionInput): Permission
    createCategory(categoryInput: CategoryInput): Category
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);