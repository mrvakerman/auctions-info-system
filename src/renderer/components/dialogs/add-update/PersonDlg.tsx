import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { Person } from "../../../utils/types";

type Props = {
  entity?: Person,
  onClose: () => any,
  onSave: (entity: Person) => any
  onUpdate: (entity: Person) => any
}

export function PersonDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Person>(entity ?? { id: 0, fio: "", age: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.fio && parseInt(`${obj.age}`) > 17))
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
    title={entity ? "Изменение персоны" : "Добавление персоны"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="ФИО">
        <InputGroup
          autoFocus
          id={"fio"}
          value={obj.fio}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label="Возраст">
        <InputGroup
          min={0}
          id={"age"}
          type={"number"}
          value={`${obj.age}`}
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