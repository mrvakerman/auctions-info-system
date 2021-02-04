import { Button, ButtonGroup, Menu, MenuDivider, MenuItem, Navbar, Popover } from "@blueprintjs/core";
import React from "react";
import { ConnectionParams, User } from "../utils/types";

type Props = {
  user: User | undefined;
  onOpenMain: () => any;
  onOpenUsers: () => any;
  onOpenGeneric: () => any;
  onSelect: (table: string) => any;
  onUserChange: () => any;
  onExit: () => any;
}

export function Navigation(props: Props) {
  const {
    user, onOpenMain, onOpenUsers, onOpenGeneric,
    onSelect, onUserChange, onExit
  } = props;

  function handleClickByMenuItem(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    onSelect(event.currentTarget.id);
  }

  return <Navbar>
    <ButtonGroup large>
      <Button
        outlined
        text="Главная"
        onClick={onOpenMain}
      />
      {user && user.user === "root" && <Button
				outlined
				id={"users"}
				text="Пользователи"
				onClick={onOpenUsers}
			/>}
      {user && user.user === "root" && <Button
				outlined
				id={"generic"}
				text="Своя таблица"
				onClick={onOpenGeneric}
			/>}
      <Popover
        content={
          <Menu>
            <MenuItem text={"Аукционы"}>
              <MenuItem id={"auction"} text={"Аукционы"} onClick={handleClickByMenuItem} />
              <MenuItem id={"auction_lot"} text={"Лоты"} onClick={handleClickByMenuItem} />
              <MenuItem id={"bet"} text={"Ставки"} onClick={handleClickByMenuItem} />
              <MenuItem id={"sold_auction_lot"} text={"Проданные лоты"} onClick={handleClickByMenuItem} />
            </MenuItem>
            <MenuItem text="Локации">
              <MenuItem id={"country"} text="Страны" onClick={handleClickByMenuItem} />
              <MenuItem id={"city"} text="Города" onClick={handleClickByMenuItem} />
            </MenuItem>
            <MenuItem text="Организации">
              <MenuItem id={"auctioneer"} text="Аукционеры" onClick={handleClickByMenuItem} />
              <MenuItem id={"website"} text="Сайты" onClick={handleClickByMenuItem} />
              <MenuItem id={"partner"} text="Партнеры" onClick={handleClickByMenuItem} />
            </MenuItem>
            <MenuItem text="Физические лица">
              <MenuItem id={"person"} text="Люди" onClick={handleClickByMenuItem} />
              <MenuItem id={"employee"} text="Сотрудники" onClick={handleClickByMenuItem} />
              <MenuItem id={"auction_member"} text="Участники" onClick={handleClickByMenuItem} />
              <MenuItem id={"contact"} text="Контакты" onClick={handleClickByMenuItem} />
            </MenuItem>
            <MenuItem text="Разное">
              <MenuItem id={"auction_type"} text="Типы аукционов" onClick={handleClickByMenuItem} />
              <MenuItem id={"category"} text="Категории лотов" onClick={handleClickByMenuItem} />
            </MenuItem>
          </Menu>
        }
        target={
          <Button
            large
            outlined
            text={"Справочники"}
          />
        }
      />
    </ButtonGroup>
    {user && <Popover
			content={
        <Menu>
          <MenuItem text={`Url: ${user.host}`} />
          <MenuItem text={`База данных: ${user.database}`} />
          <MenuDivider />
          <MenuItem
            text={"Сменить пользователя"}
            intent={"warning"}
            icon={"refresh"}
            onClick={onUserChange}
          />
          <MenuItem
            text={"Выход"}
            intent={"danger"}
            icon={"log-out"}
            onClick={onExit}
          />
        </Menu>
      }
			target={
        <Button
          large
          outlined
          icon={"user"}
          text={user.user}
        />
      }
		/>}
  </Navbar>
}