import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup } from "@blueprintjs/core";
import { Auctioneer, Employee, Person } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: Employee,
  onClose: () => any,
  onSave: (entity: Employee) => any
  onUpdate: (entity: Employee) => any
}

export function EmployeeDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Employee>(entity ?? { id: 0, id_auctioneer: 0, id_person: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.id_auctioneer && obj.id_person))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChangeAuctioneerId(item?: Auctioneer) {
    setObj({ ...obj, id_auctioneer: item?.id ?? 0 });
  }

  function handleChangePersonId(item?: Person) {
    setObj({ ...obj, id_person: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение сотрудника" : "Добавление сотрудника"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label={"Аукционер"}>
        <GenericSelector<Auctioneer>
          table={"auctioneer"}
          selected={obj.id_auctioneer}
          itemName={item => item.auctioneerName}
          onSelect={handleChangeAuctioneerId}
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