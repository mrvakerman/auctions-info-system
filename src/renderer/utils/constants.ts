import { TableName } from "./types";

export const tableNames: TableName[] = [
  "auction",
  "auction_lot",
  "bet",
  "sold_auction_lot",
  "country",
  "city",
  "auctioneer",
  "website",
  "partner",
  "person",
  "employee",
  "auction_member",
  "contact",
  "auction_type",
  "category"
];

export const auctionHeaders: string[] = ["id", "auctionName", "start_date", "id_auctioneer", "id_type"]

export const auctionLotHeaders: string[] = [
  "id", "lotName", "description", "initial_cost", "min_increment", "max_increment", "current_cost", "id_category",
  "id_auction"
]

export const auctionMemberHeaders: string[] = ["id", "id_person", "id_auction"];

export const auctionTypeHeaders: string[] = ["id", "typeName"];

export const auctioneerHeaders: string[] = ["id", "auctioneerName", "id_city"]

export const betHeaders: string[] = ["id", "cost_increment", "id_lot", "id_member"]

export const categoryHeaders: string[] = ["id", "categoryName"]

export const cityHeaders: string[] = ["id", "cityName", "id_country"]

export const contactHeaders: string[] = ["id", "value", "id_person"]

export const countryHeaders: string[] = ["id", "countryName"]

export const employeeHeaders: string[] = ["id", "id_person", "id_auctioneer"]

export const partnerHeaders: string[] = ["id", "id_auctioneer", "id_website"]

export const personHeaders: string[] = ["id", "fio", "age"]

export const soldAuctionLotHeaders: string[] = ["id", "sold_date", "id_bet"]

export const webSiteHeaders: string[] = ["id", "websiteName"]
