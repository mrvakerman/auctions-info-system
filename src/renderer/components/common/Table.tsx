import React, { useEffect, useMemo, useState } from "react";
import {
  Auction,
  Auctioneer,
  AuctionItem,
  AuctionMember,
  AuctionType,
  Bet,
  Category, City, Contact, Country, Employee,
  Entity, Partner, Person, SoldAuctionLot,
  TableName, WebSite
} from "../../utils/types";
import { Button, Checkbox } from "@blueprintjs/core";
import {
  auctioneerHeaders,
  auctionHeaders,
  auctionLotHeaders,
  auctionMemberHeaders,
  auctionTypeHeaders,
  betHeaders,
  categoryHeaders,
  cityHeaders,
  contactHeaders,
  countryHeaders,
  employeeHeaders,
  partnerHeaders, personHeaders, soldAuctionLotHeaders, webSiteHeaders
} from "../../utils/constants";

type Props = {
  table: TableName;
  items: any[];
  onSelect: (selected: Entity[]) => any;
  onChange: (entity: Entity) => any;
  onDelete: (entity: Entity) => any;
}

export function GenericTable(props: Props) {
  const [selected, setSelected] = useState<Entity[]>([]);

  useEffect(() => {
    setSelected([])
  }, [props.items])

  useEffect(() => {
    props.onSelect(selected);
  }, [selected])

  const fields = useMemo(() => {
    let fields: string[];
    switch (props.table) {
      case "auction":
        fields = auctionHeaders;
        break;
      case "auction_lot":
        fields = auctionLotHeaders;
        break;
      case "auction_member":
        fields = auctionMemberHeaders;
        break;
      case "auction_type":
        fields = auctionTypeHeaders;
        break;
      case "auctioneer":
        fields = auctioneerHeaders;
        break;
      case "bet":
        fields = betHeaders;
        break;
      case "category":
        fields = categoryHeaders;
        break;
      case "city":
        fields = cityHeaders;
        break;
      case "contact":
        fields = contactHeaders;
        break;
      case "country":
        fields = countryHeaders;
        break;
      case "employee":
        fields = employeeHeaders;
        break;
      case "partner":
        fields = partnerHeaders;
        break;
      case "person":
        fields = personHeaders;
        break;
      case "sold_auction_lot":
        fields = soldAuctionLotHeaders;
        break;
      case "website":
        fields = webSiteHeaders;
        break;
      default:
        fields = []
    }
    return ["", ...fields, "actions"]
      .map(field => <th key={field}>{field}</th>);
  }, [props.table])

  function getRows(table: TableName, items: any) {
    return items.map((item: any) => {
      switch (table) {
        case "auction":
          return getAuctionRow(table, item as Auction);
        case "auction_lot":
          return getAuctionItemRow(table, item as AuctionItem);
        case "auction_member":
          return getAuctionMemberRow(table, item as AuctionMember);
        case "auction_type":
          return getAuctionTypeRow(table, item as AuctionType);
        case "auctioneer":
          return getAuctioneerRow(table, item as Auctioneer);
        case "bet":
          return getBetRow(table, item as Bet);
        case "category":
          return getCategoryRow(table, item as Category);
        case "city":
          return getCityRow(table, item as City);
        case "contact":
          return getContactRow(table, item as Contact);
        case "country":
          return getCountryRow(table, item as Country);
        case "employee":
          return getEmployeeRow(table, item as Employee);
        case "partner":
          return getPartnerRow(table, item as Partner);
        case "person":
          return getPersonRow(table, item as Person);
        case "sold_auction_lot":
          return getSoldAuctionLotRow(table, item as SoldAuctionLot);
        case "website":
          return getWebSiteRow(table, item as WebSite);
        default:
          return undefined
      }
    })
  }

  function getAuctionRow(table: TableName, item: Auction) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td>{item.auctionName}</td>
      <td className={"center"}>{item.start_date}</td>
      <td className={"center"}>{item.id_auctioneer}</td>
      <td className={"center"}>{item.id_type}</td>
      {getActions(item)}
    </tr>
  }

  function getAuctionItemRow(table: TableName, item: AuctionItem) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td>{item.lotName}</td>
      {/*todo overflow*/}
      <td>{item.description}</td>
      <td className={"center"}>{item.initial_cost}</td>
      <td className={"center"}>{item.min_increment}</td>
      <td className={"center"}>{item.max_increment}</td>
      <td className={"center"}>{item.current_cost}</td>
      <td className={"center"}>{item.id_category}</td>
      <td className={"center"}>{item.id_auction}</td>
      {getActions(item)}
    </tr>
  }

  function getAuctionMemberRow(table: TableName, item: AuctionMember) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.id_person}</td>
      <td className={"center"}>{item.id_auction}</td>
      {getActions(item)}
    </tr>
  }

  function getAuctionTypeRow(table: TableName, item: AuctionType) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.typeName}</td>
      {getActions(item)}
    </tr>
  }

  function getAuctioneerRow(table: TableName, item: Auctioneer) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td>{item.auctioneerName}</td>
      <td className={"center"}>{item.id_city}</td>
      {getActions(item)}
    </tr>
  }

  function getBetRow(table: TableName, item: Bet) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.cost_increment}</td>
      <td className={"center"}>{item.id_lot}</td>
      <td className={"center"}>{item.id_member}</td>
      {getActions(item)}
    </tr>
  }

  function getCategoryRow(table: TableName, item: Category) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.categoryName}</td>
      {getActions(item)}
    </tr>
  }

  function getCityRow(table: TableName, item: City) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.cityName}</td>
      <td className={"center"}>{item.id_country}</td>
      {getActions(item)}
    </tr>
  }

  function getContactRow(table: TableName, item: Contact) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.value}</td>
      <td className={"center"}>{item.id_person}</td>
      {getActions(item)}
    </tr>
  }

  function getCountryRow(table: TableName, item: Country) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.countryName}</td>
      {getActions(item)}
    </tr>
  }

  function getEmployeeRow(table: TableName, item: Employee) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.id_person}</td>
      <td className={"center"}>{item.id_auctioneer}</td>
      {getActions(item)}
    </tr>
  }

  function getPartnerRow(table: TableName, item: Partner) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.id_auctioneer}</td>
      <td className={"center"}>{item.id_website}</td>
      {getActions(item)}
    </tr>
  }

  function getPersonRow(table: TableName, item: Person) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td>{item.fio}</td>
      <td className={"center"}>{item.age}</td>
      {getActions(item)}
    </tr>
  }

  function getSoldAuctionLotRow(table: TableName, item: SoldAuctionLot) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.sold_date}</td>
      <td className={"center"}>{item.id_bet}</td>
      {getActions(item)}
    </tr>
  }

  function getWebSiteRow(table: TableName, item: WebSite) {
    return <tr
      key={item.id}
      onDoubleClick={() => handleSelect(item, !selected.some(s => s.id === item.id))}
    >
      {getCheckbox(item as Entity)}
      <td className={"center"}>{item.id}</td>
      <td className={"center"}>{item.websiteName}</td>
      {getActions(item)}
    </tr>
  }

  function handleSelect(item: Entity, isSelected: boolean) {
    if (isSelected) {
      setSelected([...selected, item])
    } else {
      setSelected(selected.filter(s => s.id !== item.id))
    }
  }

  function getCheckbox(item: Entity) {
    return <td>
      <Checkbox
        key={item.id}
        checked={selected.some(s => s.id === item.id)}
        onChange={event => handleSelect(item, event.currentTarget.checked)}
      />
    </td>
  }

  function getActions(item: Entity) {
    return <td className={"actions"}>
      <Button
        small
        minimal
        intent={"primary"}
        icon={"edit"}
        onClick={() => props.onChange(item)}
      />
      <Button
        small
        minimal
        intent={"danger"}
        icon={"trash"}
        onClick={() => props.onDelete(item)}
      />
    </td>
  }

  return (
    <table className={"generic-table"}>
      <thead>
      <tr>
        {props.table ? fields : undefined}
      </tr>
      </thead>
      <tbody>
      {getRows(props.table, props.items.sort((a, b) => a.id - b.id))}
      </tbody>
    </table>
  );
}