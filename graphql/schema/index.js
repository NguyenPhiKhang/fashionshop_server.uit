const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
  _id: ID!
  email: String!
  password: String
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
type Permission{
  _id: ID!
  name: String!
  desc: String
}
input UserInput {
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
    getPermission: [Permission]
}
type RootMutation {
    createUser(userInput: UserInput): User
    createPermission(permissionInput: PermissionInput): Permission
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);