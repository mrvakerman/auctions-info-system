import React, { useEffect, useState } from "react";
import { Button, Checkbox, Classes, Dialog, FormGroup, InputGroup, Tooltip } from "@blueprintjs/core";
import { User } from "../../../utils/types";

type Props = {
  user: User;
  onClose: () => any;
  onSave: (params: User) => any;
}

export function UserDlg({ user, onClose, onSave }: Props) {
  const [obj, setObj] = useState<User>({
    host: user.host,
    database: user.database,
    user: "",
    password: "",
    isSelect: "Y",
    isInsert: "N",
    isUpdate: "N",
    isDelete: "N",
  });
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.user))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.checked });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={"Создание пользователя"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
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
      <FormGroup inline label={"Доступ: Добавление данных"}>
        <Checkbox
          id={"isInsert"}
          checked={obj.isInsert}
          onChange={handleChecked}
        />
      </FormGroup>
      <FormGroup inline label={"Доступ: Изменение данных"}>
        <Checkbox
          id={"isUpdate"}
          checked={obj.isUpdate}
          onChange={handleChecked}
        />
      </FormGroup>
      <FormGroup inline label={"Доступ: Удаление данных"}>
        <Checkbox
          id={"isDelete"}
          checked={obj.isDelete}
          onChange={handleChecked}
        />
      </FormGroup>
    </form>
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button text={"Отмена"} onClick={onClose} />
        <Button
          disabled={!valid}
          intent={"primary"}
          text={"Сохранить"}
          onClick={() => onSave(obj)}
        />
      </div>
    </div>
  </Dialog>
}
