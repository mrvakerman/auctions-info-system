import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { WebSite } from "../../../utils/types";

type Props = {
  entity?: WebSite,
  onClose: () => any,
  onSave: (entity: WebSite) => any
  onUpdate: (entity: WebSite) => any
}

export function WebSiteDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<WebSite>(entity ?? { id: 0, websiteName: "" });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!obj.websiteName)
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение сайта" : "Добавление сайта"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Название сайта">
        <InputGroup
          id={"websiteName"}
          value={obj.websiteName}
          onChange={handleChanging}
        />
      </FormGroup>
    </form>
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button text={"Отмена"} onClick={onClose} />
        {!entity && <Button
					disabled={!valid}
					intent={"primary"}
					text={"Сохранить"}
					onClick={() => onSave(obj)}
				/>}
        {entity && <Button
					disabled={!valid}
					intent={"primary"}
					text={"Редактировать"}
					onClick={() => onUpdate(obj)}
				/>}
      </div>
    </div>
  </Dialog>
}