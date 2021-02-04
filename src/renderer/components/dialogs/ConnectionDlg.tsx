import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup, Tooltip } from "@blueprintjs/core";
import { ConnectionParams } from "../../utils/types";
import { SCHEMA } from "../../../main/queries";

type Props = {
  onClose: () => any;
  onConfirm: (params: ConnectionParams) => any;
}

export function ConnectionDlg({ onClose, onConfirm }: Props) {
  const [obj, setObj] = useState<ConnectionParams>({ host: "localhost", database: "auctions", user: "", password: "" });
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.host && obj.database && obj.user))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) onConfirm(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={"Параметры соединения с базой данных"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Url базы данных">
        <InputGroup
          autoFocus
          id={"host"}
          value={obj.host}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label="База данных">
        <InputGroup
          id={"database"}
          value={obj.database}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label="Имя пользователя">
        <InputGroup
          id={"user"}
          value={obj.user}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label="Пароль пользователя">
        <InputGroup
          id={"password"}
          type={isPassword ? "password" : "text"}
          value={obj.password}
          onChange={handleChanging}
          rightElement={
            <Tooltip content={`${isPassword ? "Показать" : "Скрыть"} пароль`}>
              <Button
                icon={isPassword ? "eye-off" : "eye-open"}
                minimal={true}
                onClick={() => setIsPassword(!isPassword)}
              />
            </Tooltip>
          }
        />
      </FormGroup>
    </form>
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button text={"Отмена"} onClick={onClose} />
        <Button
          disabled={!valid}
          intent={"primary"}
          text={"Подключиться"}
          onClick={() => onConfirm(obj)}
        />
        <Button
          intent={"danger"}
          text={"Сгенерировать скрипт"}
          onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([SCHEMA], { type: 'text/plain' }));
            a.download = `auctions-schema.sql`;
            a.click();
          }}
        />
      </div>
    </div>
  </Dialog>
}
