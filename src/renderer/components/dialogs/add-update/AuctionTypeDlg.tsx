import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { AuctionType } from "../../../utils/types";

type Props = {
  entity?: AuctionType,
  onClose: () => any,
  onSave: (entity: AuctionType) => any
  onUpdate: (entity: AuctionType) => any
}

export function AuctionTypeDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<AuctionType>(entity ?? { id: 0, typeName: "" });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!obj.typeName)
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
    title={entity ? "Изменение типа аукциона" : "Добавление типа аукциона"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Наименование">
        <InputGroup
          autoFocus
          id={"typeName"}
          value={obj.typeName}
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