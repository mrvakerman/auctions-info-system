export type TableName = "auction" | "auction_lot" | "bet" | "sold_auction_lot" | "country" | "city" | "auctioneer" |
  "website" | "partner" | "person" | "employee" | "auction_member" | "contact" | "auction_type" | "category";

export enum EVENTS {
  CREATE_CONNECTION = "CREATE_CONNECTION",
  ERROR = "ERROR",
  CHANGING_SUCCESSFUL = "CHANGING_SUCCESSFUL",
  CONNECTION_SUCCESSFUL = "CONNECTION_SUCCESSFUL",

  DAILY_AUCTIONS = "DAILY_AUCTIONS",
  WEEKLY_AUCTIONS = "WEEKLY_AUCTIONS",
  MONTHLY_AUCTIONS = "MONTHLY_AUCTIONS",

  USER_CHANGE = "USER_CHANGE",
  LOG_OUT = "LOG_OUT",

  REQUEST_USER = "REQUEST_USER",
  REQUEST_USERS = "REQUEST_USERS",
  CREATE_USER = "CREATE_USER",
  CHANGE_PRIVS = "CHANGE_PRIVS",
  RESET_PASS = "RESET_PASS",
  DELETE_USER = "DELETE_USER",
  RESPONSE_USERS = "RESPONSE_USERS",

  GENERIC_REQUEST = "GENERIC_REQUEST",

  REQUEST_DATA = "REQUEST_DATA",
  RESPONSE_DATA = "RESPONSE_DATA",

  REQUEST_SELECTOR_ITEMS = "REQUEST_SELECTOR_ITEMS",
  RESPONSE_SELECTOR_ITEMS = "RESPONSE_SELECTOR_ITEMS",

  ADD_ENTITY = "ADD_ENTITY",
  UPDATE_ENTITY = "UPDATE_ENTITY",
  DELETE_ENTITIES = "DELETE_ENTITIES"
}



export type ConnectionParams = {
  host: string;
  database: string;
  user: string;
  password: string;
}

export type User = {
  isSelect: any;
  isInsert: any;
  isUpdate: any;
  isDelete: any;
} & ConnectionParams

export type Entity = {
  id: number;
}

export type Auction = {
  auctionName: string;
  start_date: string;
  id_auctioneer: number;
  id_type: number;
} & Entity;

export type AuctionItem = {
  lotName: string;
  description?: string;
  initial_cost: number;
  min_increment: number;
  max_increment: number;
  current_cost: number;
  id_category?: number;
  id_auction: number;
} & Entity;

export type AuctionMember = {
  fio?: string;
  id_person: number;
  id_auction: number;
} & Entity

export type AuctionType = {
  typeName: string;
} & Entity

export type Auctioneer = {
  auctioneerName: string;
  id_city: number;
} & Entity

export type Bet = {
  id_lot: number;
  id_member: number;
  cost_increment: number;
  fio?: string;
  lotName?: string;
} & Entity

export type Category = {
  categoryName: string;
} & Entity

export type City = {
  cityName: string;
  id_country: number;
  countryName?: string;
} & Entity

export type Contact = {
  value: string;
  id_person: number;
} & Entity

export type Country = {
  countryName: string;
} & Entity

export type Employee = {
  id_person: number;
  id_auctioneer: number;
} & Entity

export type Partner = {
  id_auctioneer: number;
  id_website: number;
} & Entity

export type Person = {
  fio: string;
  age: number;
} & Entity

export type SoldAuctionLot = {
  id_bet: number;
  sold_date: string;
} & Entity

export type WebSite = {
  websiteName: string;
} & Entity