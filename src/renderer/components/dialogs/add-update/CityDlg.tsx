import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { City, Country } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: City,
  onClose: () => any,
  onSave: (entity: City) => any
  onUpdate: (entity: City) => any
}

export function CityDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<City>(entity ?? { id: 0, cityName: "", id_country: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.cityName && obj.id_country))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChangeCountryId(item?: Country) {
    setObj({ ...obj, id_country: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение города" : "Добавление города"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Наименование">
        <InputGroup
          id={"cityName"}
          value={obj.cityName}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label={"Страна"}>
        <GenericSelector<Country>
          table={"country"}
          selected={obj.id_country}
          itemName={item => item.countryName}
          onSelect={handleChangeCountryId}
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