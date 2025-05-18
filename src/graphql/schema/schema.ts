
export const graphQLSchema = `#graphql

type Query {
  # Basic queries
  hello: String

  # Users
  users: [User]
  user(id: ID!): User

  # Businesses and related
  businesses: [Business]
  business(id: ID!): Business
  businessBranches(businessId: ID!): [Branch]
  businessMenus(businessId: ID!): [Menu]
  businessProducts(businessId: ID!): [Product]
  businessAppointments(businessId: ID!): [Appointment]
  businessBookings(businessId: ID!): [Booking]
  businessReviews(businessId: ID!): [Review]
  businessGalleries(businessId: ID!): [MediaGallery]
  businessInquiries(businessId: ID!): [Inquiry]
  businessProperties(businessId: ID!): [Property]
  businessDonations(businessId: ID!): [Donation]
  businessBlogs(businessId: ID!): [Blog]
  businessOrders(businessId: ID!): [Order]
  businessPayments(businessId: ID!): [Payment]
  businessSubscriptions(businessId: ID!): [Subscription]
  businessAboutPage(businessId: ID!): AboutPage

  # Customers
  customers(businessId: ID!): [CustomerUser]
  customer(id: ID!): CustomerUser

  # Individual items
  menu(id: ID!): Menu
  menuItem(id: ID!): MenuItem
  product(id: ID!): Product
  appointment(id: ID!): Appointment
  booking(id: ID!): Booking
  review(id: ID!): Review
  gallery(id: ID!): MediaGallery
  inquiry(id: ID!): Inquiry
  property(id: ID!): Property
  donation(id: ID!): Donation
  blog(id: ID!): Blog
  order(id: ID!): Order
  payment(id: ID!): Payment
  subscription(id: ID!): Subscription
  plan(id: ID!): Plan

  # Plans
  plans: [Plan]

  # Audit Logs (for admin)
  auditLogs(businessId: ID!): [AuditLog]

  # Invitations
  invitations(businessId: ID!): [Invitation]
}

type Mutation {
  # User mutations
  createUser(role: Role): User!
  updateUser(id: ID!, name: String, role: Role, businessId: ID): User!
  deleteUser(id: ID!): Boolean!

  # Business mutations
  createBusiness(
    name: String!
    category: BusinessCategory!
    description: String
    address: String
    phone: String
    websiteUrl: String
  ): Business!
  updateBusiness(
    id: ID!
    name: String
    category: BusinessCategory
    description: String
    address: String
    phone: String
    websiteUrl: String
  ): Business!
  deleteBusiness(id: ID!): Boolean!

  # Branch mutations
  createBranch(
    businessId: ID!
    name: String!
    address: String!
    city: String!
    state: String!
    pincode: String!
    phone: String
  ): Branch!
  updateBranch(
    id: ID!
    name: String
    address: String
    city: String
    state: String
    pincode: String
    phone: String
  ): Branch!
  deleteBranch(id: ID!): Boolean!

  # CustomerUser mutations
  createCustomerUser(
    businessId: ID!
    name: String!
    email: String
    phone: String
  ): CustomerUser!
  updateCustomerUser(
    id: ID!
    name: String
    email: String
    phone: String
  ): CustomerUser!
  deleteCustomerUser(id: ID!): Boolean!

  # Payment mutations
  createPayment(
    amount: Float!
    method: PaymentMethod!
    status: PaymentStatus
    initiatedAt: String!
    verifiedAt: String
    paidAt: String
    referenceId: String
    razorpayOrderId: String
    razorpayPaymentId: String
    razorpaySignature: String
    receiptURL: String
    customerRole: Role!
    customerName: String
    customerEmail: String
    businessId: ID!
  ): Payment!
  updatePayment(
    id: ID!
    status: PaymentStatus
    verifiedAt: String
    paidAt: String
  ): Payment!
  deletePayment(id: ID!): Boolean!

  # Menu and MenuItem mutations
  createMenu(businessId: ID!, title: String!): Menu!
  updateMenu(id: ID!, title: String): Menu!
  deleteMenu(id: ID!): Boolean!

  createMenuItem(menuId: ID!, name: String!, price: Float!, imageUrl: String): MenuItem!
  updateMenuItem(id: ID!, name: String, price: Float, imageUrl: String): MenuItem!
  deleteMenuItem(id: ID!): Boolean!

  # Appointment mutations
  createAppointment(
    businessId: ID!
    customerName: String!
    customerPhone: String
    customerEmail: String
    dateTime: String!
    service: String!
  ): Appointment!
  updateAppointment(
    id: ID!
    customerName: String
    customerPhone: String
    customerEmail: String
    dateTime: String
    service: String
    status: AppointmentStatus
  ): Appointment!
  deleteAppointment(id: ID!): Boolean!

  # Booking mutations
  createBooking(
    businessId: ID!
    dateTime: String!
    customerName: String!
    service: String!
  ): Booking!
  updateBooking(
    id: ID!
    dateTime: String
    customerName: String
    service: String
  ): Booking!
  deleteBooking(id: ID!): Boolean!

  # Product mutations
  createProduct(
    businessId: ID!
    name: String!
    price: Float!
    stock: Int
    tags: [String!]
    description: String
    imageUrl: String!
  ): Product!
  updateProduct(
    id: ID!
    name: String
    price: Float
    stock: Int
    tags: [String!]
    description: String
    imageUrl: String
  ): Product!
  deleteProduct(id: ID!): Boolean!

  # Review mutations
  createReview(
    businessId: ID!
    customer: String!
    rating: Int!
    comment: String
  ): Review!
  updateReview(id: ID!, rating: Int, comment: String): Review!
  deleteReview(id: ID!): Boolean!

  # MediaGallery mutations
  createMediaGallery(businessId: ID!, title: String!, mediaUrls: [String!]!): MediaGallery!
  updateMediaGallery(id: ID!, title: String, mediaUrls: [String!]): MediaGallery!
  deleteMediaGallery(id: ID!): Boolean!

  # Inquiry mutations
  createInquiry(businessId: ID!, name: String!, email: String!, message: String!): Inquiry!
  updateInquiry(id: ID!, name: String, email: String, message: String): Inquiry!
  deleteInquiry(id: ID!): Boolean!

  # Property mutations
  createProperty(
    businessId: ID!
    title: String!
    description: String!
    price: Float!
    location: String!
    imageUrl: String
  ): Property!
  updateProperty(
    id: ID!
    title: String
    description: String
    price: Float
    location: String
    imageUrl: String
  ): Property!
  deleteProperty(id: ID!): Boolean!

  # Donation mutations
  createDonation(
    businessId: ID!
    donorName: String!
    amount: Float!
    date: String!
  ): Donation!
  updateDonation(id: ID!, donorName: String, amount: Float, date: String): Donation!
  deleteDonation(id: ID!): Boolean!

  # Blog mutations
  createBlog(businessId: ID!, title: String!, content: String!, imageUrl: String): Blog!
  updateBlog(id: ID!, title: String, content: String, imageUrl: String): Blog!
  deleteBlog(id: ID!): Boolean!

  # Order mutations
  createOrder(
    businessId: ID!
    type: OrderType!
    items: JSON!
    totalAmount: Float!
    customerUserId: ID
  ): Order!
  updateOrder(
    id: ID!
    status: OrderStatus
  ): Order!
  deleteOrder(id: ID!): Boolean!

  # AuditLog mutations (usually restricted)
  createAuditLog(
    action: String!
    userId: ID!
    businessId: ID!
  ): AuditLog!

  # Invitation mutations
  createInvitation(email: String!, role: String!, businessId: ID!, expiresAt: String!): Invitation!
  deleteInvitation(id: ID!): Boolean!

  # BusinessSettings mutations
  updateBusinessSettings(
    businessId: ID!
    currency: String
    timezone: String
    logoUrl: String
  ): BusinessSettings!

  # Plan mutations (admin)
  createPlan(name: String!, description: String, price: Float!, features: [String!]!): Plan!
  updatePlan(id: ID!, name: String, description: String, price: Float, features: [String!]): Plan!
  deletePlan(id: ID!): Boolean!

  # Subscription mutations
  createSubscription(businessId: ID!, planId: ID!, startDate: String!): Subscription!
  updateSubscription(id: ID!, status: SubscriptionStatus, endDate: String, lastRenewed: String): Subscription!
  cancelSubscription(id: ID!): Subscription!
}

# Scalar for JSON (items in Order)
scalar JSON

# Models (simplified for GraphQL, reflect your Prisma models)
type User {
  id: ID!
  email: String!
  name: String!
  role: Role!
  businessId: ID
  websiteURLs: [String!]!
  createdAt: String!
  updatedAt: String!
}

enum Role {
  ADMIN
  CLIENT
  STAFF
  
}

enum BusinessCategory {
  FOOD
  GENERAL
  SERVICE
  RETAIL
  OTHER
}

enum PaymentMethod {
  CASH
  CREDIT_CARD
  DEBIT_CARD
  UPI
  WALLET
  BANK_TRANSFER
  OTHER
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum OrderType {
  ONLINE
  IN_STORE
  PICKUP
  DELIVERY
}

enum OrderStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  REFUNDED
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PENDING
}

type User {
  id: ID!
  email: String!
  name: String!
  role: Role!
  businessId: ID
  websiteURLs: [String!]!
  createdAt: String!
  updatedAt: String!
}

type Business {
  id: ID!
  name: String!
  category: BusinessCategory!
  description: String
  address: String
  phone: String
  websiteUrl: String
  createdAt: String!
  updatedAt: String!
  branches: [Branch]
  menus: [Menu]
  products: [Product]
  appointments: [Appointment]
  bookings: [Booking]
  reviews: [Review]
  galleries: [MediaGallery]
  inquiries: [Inquiry]
  properties: [Property]
  donations: [Donation]
  blogs: [Blog]
  orders: [Order]
  payments: [Payment]
  subscriptions: [Subscription]
  aboutPage: AboutPage
  settings: BusinessSettings
}

type Branch {
  id: ID!
  businessId: ID!
  name: String!
  address: String!
  city: String!
  state: String!
  pincode: String!
  phone: String
  createdAt: String!
  updatedAt: String!
}

type CustomerUser {
  id: ID!
  businessId: ID!
  name: String!
  email: String
  phone: String
  createdAt: String!
  updatedAt: String!
}

type Menu {
  id: ID!
  businessId: ID!
  title: String!
  menuItems: [MenuItem]
  createdAt: String!
  updatedAt: String!
}

type MenuItem {
  id: ID!
  menuId: ID!
  name: String!
  price: Float!
  imageUrl: String
  createdAt: String!
  updatedAt: String!
}

type Product {
  id: ID!
  businessId: ID!
  name: String!
  price: Float!
  stock: Int
  tags: [String]
  description: String
  imageUrl: String
  createdAt: String!
  updatedAt: String!
}

type Appointment {
  id: ID!
  businessId: ID!
  customerName: String!
  customerPhone: String
  customerEmail: String
  dateTime: String!
  service: String!
  status: AppointmentStatus!
  createdAt: String!
  updatedAt: String!
}

type Booking {
  id: ID!
  businessId: ID!
  dateTime: String!
  customerName: String!
  service: String!
  createdAt: String!
  updatedAt: String!
}

type Review {
  id: ID!
  businessId: ID!
  customer: String!
  rating: Int
  comment: String
  createdAt: String!
  updatedAt: String!
}

type MediaGallery {
  id: ID!
  businessId: ID!
  title: String!
  mediaUrls: [String!]!
  createdAt: String!
  updatedAt: String!
}

type Inquiry {
  id: ID!
  businessId: ID!
  name: String!
  email: String!
  message: String!
  createdAt: String!
  updatedAt: String!
}

type Property {
  id: ID!
  businessId: ID!
  title: String!
  description: String
  price: Float!
  location: String!
  imageUrl: String
  createdAt: String!
  updatedAt: String!
}

type Donation {
  id: ID!
  businessId: ID!
  donorName: String!
  amount: Float!
  date: String!
  createdAt: String!
  updatedAt: String!
}

type Blog {
  id: ID!
  businessId: ID!
  title: String!
  content: String!
  imageUrl: String
  createdAt: String!
  updatedAt: String!
}

type Order {
  id: ID!
  businessId: ID!
  type: OrderType!
  items: JSON
  totalAmount: Float!
  customerUserId: ID
  status: OrderStatus!
  createdAt: String!
  updatedAt: String!
}

type Payment {
  id: ID!
  amount: Float!
  method: PaymentMethod!
  status: PaymentStatus!
  initiatedAt: String!
  verifiedAt: String
  paidAt: String
  referenceId: String
  razorpayOrderId: String
  razorpayPaymentId: String
  razorpaySignature: String
  receiptURL: String
  customerRole: Role!
  customerName: String
  customerEmail: String
  businessId: ID!
  createdAt: String!
  updatedAt: String!
}

type Subscription {
  id: ID!
  businessId: ID!
  plan: Plan!
  startDate: String!
  endDate: String
  lastRenewed: String
  status: SubscriptionStatus!
  createdAt: String!
  updatedAt: String!
}

type Plan {
  id: ID!
  name: String!
  description: String
  price: Float!
  features: [String]
  createdAt: String!
  updatedAt: String!
}

type AuditLog {
  id: ID!
  action: String!
  userId: ID!
  businessId: ID!
  timestamp: String!
}

type Invitation {
  id: ID!
  email: String!
  role: String!
  businessId: ID!
  expiresAt: String!
  createdAt: String!
  updatedAt: String!
}

type BusinessSettings {
  businessId: ID!
  currency: String
  timezone: String
  logoUrl: String
  createdAt: String!
  updatedAt: String!
}

type AboutPage {
  businessId: ID!
  content: String
  imageUrl: String
  createdAt: String!
  updatedAt: String!
}

scalar JSON


`;
    