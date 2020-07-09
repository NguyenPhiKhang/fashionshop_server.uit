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
  type_size: String
  level_cat: Int!
  parent: Category
  subCat: [Category]
}
type Attribute{
  _id: ID!
  attribute_code: Int!
  name: String!
  value(typeOption: String): [Option]!
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
type LevelCategories{
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
  img_url: String
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
  attribute: [AttributeProduct]
  option_amount: [OptionAmount]
  category_id: String
  categories: LevelCategories
  record_status: Boolean!
  favoritors: [ID]
  isFavorite: Boolean
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
type AttributeProduct{
  _id: ID!
  attribute: Attribute!
  product: Product!
  value: [Option]
}
type OptionAmount{
  _id: ID!
  option_color: ID!
  option_size: ID!
  product: Product!
  amount: Int!
}
type OptionAmountCart{
  _id: ID!
  option_color: Option!
  option_size: Option!
  product: Product!
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
type Order{
  _id: ID!
  product: Product!
  option_amount: OptionAmountCart!
  amount: Int
  price_order: Float
}
type Bill{
  person: ID
  price_ship: Float
  total_price: Float
  address: String
  method_payment: String
  orders: [Order]
  delivery_status: String
  isDone: Boolean
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
  type_size: String
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
  is_freeship: Boolean
  category_id: String!
  option_amount: [OptionAmountInput]!
}
input OptionAmountInput{
  color_id: ID
  size_id: ID
  amount: Int!
}
input CartInput{
  product_id: ID!
  option_amount_id: ID!
  amount: Int
  price_order: Float
}
type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPermission: [Permission]!
    getIdPermission(name: String!): ID!
    getAllCategory(level: Int): [Category]!
    getCategoryById(id: ID!, typeOption: String): Category!
    getAllAttribute: [Attribute]!
    getAttributeById(id: ID!): Attribute!
    getAllOption: [Option]!
    getProduct(id: ID, pageNumber: Int, sort: Int, product_ids: [ID], person_id: ID): [Product]!
    getProductByCategory(level_code: Int, pageNumber: Int, colors: [ID], sizes: [ID], price_min: Float, price_max: Float): [Product]!
    searchProduct(text: String!, pageNumber: Int!): [Product]!
    renderCart(cartInput: [CartInput]): [Order]!
}
type RootMutation {
    createAccount(accountInput: AccountInput): Account
    createPermission(permissionInput: PermissionInput): Permission
    createCategory(categoryInput: CategoryInput): Category
    createAttribute(name: String!): Attribute
    createOption(optionInput: OptionInput): Option
    createProduct(productInput: ProductInput): Product
    deleteProductInLevelCategories(id: ID!, idProduct: ID!): Boolean
    deleteProduct(id: ID!): Boolean
    updateTypeSizeCat(id: Int, size: String): Boolean
    createBillProduct(person_id: ID, price_ship: Float, total_price: Float, address: String, method_payment: String, orders: [CartInput]): Bill
    actionFavorite(person_id: ID, product_id: ID): Boolean
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);