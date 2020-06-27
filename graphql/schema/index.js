const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Account {
  _id: ID!
  email: String!
  password: String
  record_status: Boolean
  person: Person!
  permission: Permission!
}
type AuthData {
  account: Account!
  token: String!
  tokenExpiration: Int!
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
  product: Product!
}
type Categories{
  _id: ID!
  category_level1: Category!
  category_level2: Category!
  category_level3: Category!
  products: [Product]!
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
  person: Person!
  product: Product!
  data: String!
  image: [String]
  star: Float
  createdAt: String!
  updatedAt: String!
}
type Attribute_Option{
  _id: ID!
  attribute: Attribute!
  product: Product!
  value: [Option_Amount]!
}
type Option_Amount{
  _id: ID!
  option_id: Option!
  attribute_option: Attribute_Option!
  amount: Int!
}
type Person{
  _id: ID!
  name: String!
  avatar: String
  sex: String
  number_phone: String
  birthday: String
  shipping_address: String
  account: Account!
  createdAt: String!
  updatedAt: String!
}
input AccountInput {
  name: String!
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