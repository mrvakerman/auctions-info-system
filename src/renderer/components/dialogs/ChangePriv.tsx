import React, { useState } from "react";
import { Button, Checkbox, Classes, Dialog, FormGroup } from "@blueprintjs/core";
import { User } from "../../utils/types";

type Props = {
  user: User;
  onClose: () => any;
  onSave: (params: User) => any;
}

export function ChangePrivDlg({ user, onClose, onSave }: Props) {
  const [obj, setObj] = useState<User>({...user});

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.checked ? "Y" : "N" });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={"Изменение уровня доступа"}
  >
    <form className={Classes.DIALOG_BODY}>
      <FormGroup inline label={"Доступ: Добавление данных"}>
        <Checkbox
          id={"isInsert"}
          checked={obj.isInsert === "Y"}
          onChange={handleChecked}
        />
      </FormGroup>
      <FormGroup inline label={"Доступ: Изменение данных"}>
        <Checkbox
          id={"isUpdate"}
          checked={obj.isUpdate === "Y"}
          onChange={handleChecked}
        />
      </FormGroup>
      <FormGroup inline label={"Доступ: Удаление данных"}>
        <Checkbox
          id={"isDelete"}
          checked={obj.isDelete === "Y"}
          onChange={handleChecked}
        />
      </FormGroup>
    </form>
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button text={"Отмена"} onClick={onClose} />
        <Button intent={"primary"} text={"Сохранить"} onClick={() => onSave(obj)} />
      </div>
    </div>
  </Dialog>
}
