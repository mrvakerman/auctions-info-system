import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { Navigation } from "./NavBar";
import { GenericTable } from "./common/Table";
import {
  Auction,
  Auctioneer, AuctionItem,
  AuctionMember,
  AuctionType, Bet,
  Category, City,
  ConnectionParams,
  Contact, Country, Employee,
  Entity,
  EVENTS, Partner,
  Person, SoldAuctionLot,
  TableName, User,
  WebSite
} from "../utils/types";
import { GenericAlert } from "./dialogs/Alert";
import { Button } from "@blueprintjs/core";
import { WebSiteDlg } from "./dialogs/add-update/WebSiteDlg";
import { ConnectionDlg } from "./dialogs/ConnectionDlg";
import { PersonDlg } from "./dialogs/add-update/PersonDlg";
import { AuctionTypeDlg } from "./dialogs/add-update/AuctionTypeDlg";
import { CategoryLotDlg } from "./dialogs/add-update/CategoryLotDlg";
import { ContactDlg } from "./dialogs/add-update/ContactDlg";
import { MemberDlg } from "./dialogs/add-update/MemberDlg";
import { EmployeeDlg } from "./dialogs/add-update/EmployeeDlg";
import { PartnerDlg } from "./dialogs/add-update/PartnerDlg";
import { AuctioneerDlg } from "./dialogs/add-update/AuctioneerDlg";
import { CountryDlg } from "./dialogs/add-update/CountryDlg";
import { CityDlg } from "./dialogs/add-update/CityDlg";
import { AuctionDlg } from "./dialogs/add-update/AuctionDlg";
import { LotDlg } from "./dialogs/add-update/LotDlg";
import { BetDlg } from "./dialogs/add-update/BetDlg";
import { SoldLotDlg } from "./dialogs/add-update/SoldLot";
import { UsersTable } from "./UsersTable";
import { Main } from "./Main";
import { GenericQueriesTable } from "./GenericQueriesTable";
import { UserDlg } from "./dialogs/add-update/UserDlg";

export function App() {
  const [alert, setAlert] = useState<JSX.Element>();
  const [dialog, setDialog] = useState<JSX.Element>();
  const [table, setTable] = useState<TableName>();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<Entity[]>([]);
  const [user, setUser] = useState<User>()
  const [tab, setTab] = useState<string>("main");
  const [isConnect, setConnect] = useState<boolean>(false);

  useEffect(() => {
    connectToDB();
    ipcRenderer.on(EVENTS.CONNECTION_SUCCESSFUL, (event, params: ConnectionParams) => {
      localStorage.setItem("CONNECTION_PARAMS", JSON.stringify(params))
      ipcRenderer.send(EVENTS.REQUEST_USER, params);
      setConnect(true);
    });
    ipcRenderer.on(EVENTS.REQUEST_USER, (event, args) => {
      if (args.items[0]) setUser(args.items[0])
    })
    ipcRenderer.on(EVENTS.ERROR, (event, err) => {
      setAlert(<GenericAlert
        icon={"error"}
        intent={"danger"}
        info={err}
        onConfirm={() => setAlert(undefined)}
        onCancel={() => setAlert(undefined)}
        onClose={() => setAlert(undefined)}
      />)
    })
    ipcRenderer.on(EVENTS.RESPONSE_DATA, (event, data) => {
      if (data) setItems(data.items);
    });
    ipcRenderer.on(EVENTS.CHANGING_SUCCESSFUL, (event, data) => {
      getData(data);
    });
  }, []);

  function connectToDB() {
    const params = localStorage.getItem("CONNECTION_PARAMS");
    if (params) {
      ipcRenderer.send(EVENTS.CREATE_CONNECTION, JSON.parse(params));
    } else {
      setDialog(
        <ConnectionDlg
          onConfirm={params => {
            ipcRenderer.send(EVENTS.CREATE_CONNECTION, params)
            setDialog(undefined);
          }}
          onClose={() => setDialog(undefined)}
        />
      )
    }
  }

  function handleSelect(value: TableName) {
    setTab("table");
    if (table !== value) {
      setTable(value);
      getData(value);
    }
  }

  function getData(table: string) {
    ipcRenderer.send(EVENTS.REQUEST_DATA, table);
  }

  function handleAdd(table: TableName, entity: Entity) {
    ipcRenderer.send(EVENTS.ADD_ENTITY, { table, entity });
    setDialog(undefined);
  }

  function handleUpdate(table: TableName, entity: Entity) {
    ipcRenderer.send(EVENTS.UPDATE_ENTITY, { table, entity });
    setDialog(undefined);
  }

  function handleDelete(entities: Entity[]) {
    setAlert(<GenericAlert
      icon={"trash"}
      intent={"danger"}
      info={`Вы действительно хотите удалить ${entities.length > 1 ? "выбранные записи" : "данную запись"}?`}
      confirmButtonText={"Да"}
      cancelButtonText={"Нет"}
      onConfirm={() => {
        ipcRenderer.send(EVENTS.DELETE_ENTITIES, { table, entities });
        setAlert(undefined);
      }}
      onCancel={() => setAlert(undefined)}
      onClose={() => setAlert(undefined)}
    />)
  }

  function handleOpenDlg(table: TableName, entity?: Entity) {
    const dialogActions = {
      onClose: () => setDialog(undefined),
      onSave: (added: Entity) => handleAdd(table, added),
      onUpdate: (updated: Entity) => handleUpdate(table, updated)
    }
    switch (table) {
      case "auction":
        setDialog(<AuctionDlg
          entity={entity as Auction}
          {...dialogActions}
        />)
        break
      case "auction_lot":
        setDialog(<LotDlg
          entity={entity as AuctionItem}
          {...dialogActions}
        />)
        break
      case "bet":
        setDialog(<BetDlg
          entity={entity as Bet}
          {...dialogActions}
        />)
        break
      case "sold_auction_lot":
        setDialog(<SoldLotDlg
          entity={entity as SoldAuctionLot}
          {...dialogActions}
        />)
        break
      case "country":
        setDialog(<CountryDlg
          entity={entity as Country}
          {...dialogActions}
        />)
        break
      case "city":
        setDialog(<CityDlg
          entity={entity as City}
          {...dialogActions}
        />)
        break
      case "auctioneer":
        setDialog(<AuctioneerDlg
          entity={entity as Auctioneer}
          {...dialogActions}
        />)
        break
      case "website":
        setDialog(<WebSiteDlg
          entity={entity as WebSite}
          {...dialogActions}
        />)
        break
      case "partner":
        setDialog(<PartnerDlg
          entity={entity as Partner}
          {...dialogActions}
        />)
        break
      case "person":
        setDialog(<PersonDlg
          entity={entity as Person}
          {...dialogActions}
        />)
        break
      case "employee":
        setDialog(<EmployeeDlg
          entity={entity as Employee}
          {...dialogActions}
        />)
        break
      case "auction_member":
        setDialog(<MemberDlg
          entity={entity as AuctionMember}
          {...dialogActions}
        />)
        break
      case "contact":
        setDialog(<ContactDlg
          entity={entity as Contact}
          {...dialogActions}
        />)
        break
      case "auction_type":
        setDialog(<AuctionTypeDlg
          entity={entity as AuctionType}
          {...dialogActions}
        />)
        break
      case "category":
        setDialog(<CategoryLotDlg
          entity={entity as Category}
          {...dialogActions}
        />)
        break
      default:
        return
    }
  }

  function handleUserChange() {
    setAlert(<GenericAlert
      icon={"refresh"}
      intent={"warning"}
      info={`Вы действительно хотите сменить пользователя?`}
      confirmButtonText={"Да"}
      cancelButtonText={"Нет"}
      onConfirm={() => {
        localStorage.removeItem("CONNECTION_PARAMS");
        ipcRenderer.send(EVENTS.USER_CHANGE)
      }}
      onCancel={() => setAlert(undefined)}
      onClose={() => setAlert(undefined)}
    />)
  }

  function handleExit() {
    setAlert(<GenericAlert
      icon={"log-out"}
      intent={"danger"}
      info={`Вы действительно хотите выйти?`}
      confirmButtonText={"Да"}
      cancelButtonText={"Нет"}
      onConfirm={() => {
        localStorage.removeItem("CONNECTION_PARAMS");
        ipcRenderer.send(EVENTS.LOG_OUT)
      }}
      onCancel={() => setAlert(undefined)}
      onClose={() => setAlert(undefined)}
    />)
  }

  return (
    <>
      {alert}
      {dialog}
      <Navigation
        user={user}
        onOpenMain={() => setTab("main")}
        onOpenUsers={() => setTab("users")}
        onOpenGeneric={() => setTab("generic")}
        onSelect={handleSelect}
        onUserChange={handleUserChange}
        onExit={handleExit}
      />
      {tab === "main" && <Main connected={isConnect} />}
      {tab !== "main" &&
			<div className={"flex grow"}>
				<div className={"table-container"}>
          {tab === "table" && <GenericTable
						table={table}
						items={items}
						onSelect={setSelected}
						onChange={(entity: Entity) => handleOpenDlg(table, entity)}
						onDelete={(entity: Entity) => handleDelete([entity])}
					/>}
          {tab === "users" && user && <UsersTable user={user} />}
          {tab === "generic" && <GenericQueriesTable />}
				</div>
        {tab !== "generic" && <div className={"actions-container"}>
          {tab !== "users" && table && <Button
						icon={"plus"}
						intent={"primary"}
						text={"Добавить"}
						onClick={() => handleOpenDlg(table)}
					/>}
          {tab === "users" && <Button
            icon={"plus"}
            intent={"primary"}
            text={"Добавить"}
            onClick={() => setDialog(<UserDlg
              onClose={() => setDialog(undefined)}
              onSave={(params) => {
                ipcRenderer.send(EVENTS.CREATE_USER, params)
                setDialog(undefined)
              }}
              user={user}
            />)}
          />}
          {selected.length ? <Button
            icon={"trash"}
            text={"Удалить выбранные"}
            intent={"danger"}
            onClick={() => handleDelete(selected)}
          /> : undefined}
				</div>}
			</div>
      }
    </>
  );
}
