import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { Auctioneer, City } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: Auctioneer,
  onClose: () => any,
  onSave: (entity: Auctioneer) => any
  onUpdate: (entity: Auctioneer) => any
}

export function AuctioneerDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Auctioneer>(entity ?? { id: 0, auctioneerName: "", id_city: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.auctioneerName && obj.id_city))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChangeCityId(item?: City) {
    setObj({ ...obj, id_city: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение аукционера" : "Добавление аукционера"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Наименование">
        <InputGroup
          autoFocus
          id={"auctioneerName"}
          value={obj.auctioneerName}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label={"Город"}>
        <GenericSelector<City>
          table={"city"}
          selected={obj.id_city}
          itemName={item => `${item.cityName} (${item.countryName})`}
          onSelect={handleChangeCityId}
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