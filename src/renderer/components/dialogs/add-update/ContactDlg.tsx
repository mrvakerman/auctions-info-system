import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { Contact, Person } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: Contact,
  onClose: () => any,
  onSave: (entity: Contact) => any
  onUpdate: (entity: Contact) => any
}

export function ContactDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Contact>(entity ?? { id: 0, value: "", id_person: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.value && obj.id_person))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChangePersonId(item?: Person) {
    setObj({ ...obj, id_person: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение контакта" : "Добавление контакта"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Контакт">
        <InputGroup
          autoFocus
          id={"value"}
          value={obj.value}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label={"Персона"}>
        <GenericSelector<Person>
          table={"person"}
          selected={obj.id_person}
          itemName={item => item.fio}
          onSelect={handleChangePersonId}
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