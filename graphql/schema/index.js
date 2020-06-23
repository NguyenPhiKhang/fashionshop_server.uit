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
}
type Permission{
  _id: ID!
  name: String!
  desc: String
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
type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPermission: [Permission]!
    getIdPermission(name: String!): ID!
}
type RootMutation {
    createAccount(accountInput: AccountInput): Account
    createPermission(permissionInput: PermissionInput): Permission
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);