import React, { useEffect, useState } from "react";
import { Button, Icon } from "@blueprintjs/core";
import { EVENTS, User } from "../utils/types";
import { ipcRenderer } from "electron";
import { ResetPassDlg } from "./dialogs/ResetPass";
import { GenericAlert } from "./dialogs/Alert";
import { ChangePrivDlg } from "./dialogs/ChangePriv";

type Props = {
  user: User;
}

export function UsersTable({ user }: Props) {
  const [dialog, setDialog] = useState<JSX.Element>();
  const [items, setUsers] = useState<User[]>([])

  useEffect(() => {
    ipcRenderer.send(EVENTS.REQUEST_USERS, user);
    ipcRenderer.on(EVENTS.RESPONSE_USERS, (event, data) => setUsers(data.items));
    ipcRenderer.on(EVENTS.CREATE_USER, () => ipcRenderer.send(EVENTS.REQUEST_USERS, user));
    ipcRenderer.on(EVENTS.CHANGE_PRIVS, () => ipcRenderer.send(EVENTS.REQUEST_USERS, user));
    ipcRenderer.on(EVENTS.RESET_PASS, () => {
      setDialog(<GenericAlert
        icon={"tick"}
        intent={"success"}
        info={"Пароль успешно изменен"}
        onConfirm={() => setDialog(undefined)}
        onClose={() => setDialog(undefined)}
      />);
    });
    ipcRenderer.on(EVENTS.DELETE_USER, () => ipcRenderer.send(EVENTS.REQUEST_USERS, user))
    return () => {
      ipcRenderer.removeAllListeners(EVENTS.REQUEST_USERS)
      ipcRenderer.removeAllListeners(EVENTS.CREATE_USER)
      ipcRenderer.removeAllListeners(EVENTS.CHANGE_PRIVS)
      ipcRenderer.removeAllListeners(EVENTS.RESET_PASS)
      ipcRenderer.removeAllListeners(EVENTS.DELETE_USER)
    }
  }, [])

  function handleResetPass(user: User) {
    setDialog(<ResetPassDlg
      onClose={() => setDialog(undefined)}
      onConfirm={password => {
        ipcRenderer.send(EVENTS.RESET_PASS, { ...user, password })
        setDialog(undefined)
      }}
    />)
  }

  function handleChangePriv(user: User) {
    setDialog(<ChangePrivDlg
      user={user}
      onClose={() => setDialog(undefined)}
      onSave={(changed) => {
        ipcRenderer.send(EVENTS.CHANGE_PRIVS, changed)
        setDialog(undefined)
      }}
    />)
  }

  function handleDeleteUser(user: User) {
    setDialog(<GenericAlert
      icon={"trash"}
      intent={"danger"}
      info={`Вы действительно хотите удалить пользователя "${user.user}"?`}
      confirmButtonText={"Да"}
      cancelButtonText={"Нет"}
      onConfirm={() => {
        ipcRenderer.send(EVENTS.DELETE_USER, user);
        setDialog(undefined);
      }}
      onCancel={() => setDialog(undefined)}
      onClose={() => setDialog(undefined)}
    />);
  }

  function getRows(item: User) {
    return <tr key={`${item.host}-${item.database}-${item.user}`}>
      <td className={"center"}>{item.host}</td>
      <td className={"center"}>{item.database}</td>
      <td className={"center"}>{item.user}</td>
      <td className={"center"}>{
        item.isSelect === "Y"
          ? <Icon icon={"tick"} intent={"success"} />
          : <Icon icon={"cross"} intent={"danger"} />
      }</td>
      <td className={"center"}>{
        item.isInsert === "Y"
          ? <Icon icon={"tick"} intent={"success"} />
          : <Icon icon={"cross"} intent={"danger"} />
      }</td>
      <td className={"center"}>{
        item.isUpdate === "Y"
          ? <Icon icon={"tick"} intent={"success"} />
          : <Icon icon={"cross"} intent={"danger"} />
      }</td>
      <td className={"center"}>{
        item.isDelete === "Y"
          ? <Icon icon={"tick"} intent={"success"} />
          : <Icon icon={"cross"} intent={"danger"} />
      }</td>
      <td className={"actions"}>
        <Button
          small
          minimal
          intent={"primary"}
          icon={"refresh"}
          onClick={() => handleResetPass(item)}
        />
        {(user.user !== item.user || item.user !== "root") && <>
					<Button
						small
						minimal
						intent={"primary"}
						icon={"take-action"}
						onClick={() => handleChangePriv(item)}
					/>
					<Button
						small
						minimal
						intent={"danger"}
						icon={"trash"}
						onClick={() => handleDeleteUser(item)}
					/>
				</>}
      </td>
    </tr>
  }

  return (
    <>
      {dialog}
      <table className={"generic-table"}>
        <thead>
        <tr>
          <th>host</th>
          <th>database</th>
          <th>user</th>
          <th>isSelect</th>
          <th>isInsert</th>
          <th>isUpdate</th>
          <th>isDelete</th>
          <th>actions</th>
        </tr>
        </thead>
        <tbody>
        {items.map(item => getRows(item))}
        </tbody>
      </table>
    </>
  );
}