import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup } from "@blueprintjs/core";
import { SoldAuctionLot, Bet } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";
import { DateInput } from "@blueprintjs/datetime";

type Props = {
  entity?: SoldAuctionLot,
  onClose: () => any,
  onSave: (entity: SoldAuctionLot) => any
  onUpdate: (entity: SoldAuctionLot) => any
}

export function SoldLotDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<SoldAuctionLot>(entity ?? {
    id: 0,
    sold_date: `${new Date()}`,
    id_bet: 0
  });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.sold_date && obj.id_bet))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChangeTypeId(item?: Bet) {
    setObj({ ...obj, id_bet: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение проданного лота" : "Добавление проданного лота"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label={"Дата"}>
        <DateInput
          fill
          minDate={new Date()}
          formatDate={date => date.toLocaleString()}
          value={new Date(obj.sold_date)}
          onChange={start_date => setObj({
            ...obj,
            sold_date: start_date.toString()
          })}
          parseDate={str => new Date(str)}
          timePrecision={"minute"}
        />
      </FormGroup>
      <FormGroup label={"Ставка"}>
        <GenericSelector<Bet>
          table={"bet"}
          selected={obj.id_bet}
          itemName={item => `${item.cost_increment} (${item.fio} -> ${item.lotName})`}
          onSelect={handleChangeTypeId}
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
					onClick={() => {
            const date = new Date(obj.sold_date);
            onSave({
              ...obj, sold_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
            ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`
            })
          }}
				/>}
        {entity && <Button
					disabled={!valid}
					intent={"primary"}
					text={"Редактировать"}
					onClick={() => {
            const date = new Date(obj.sold_date);
            onUpdate({
              ...obj, sold_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
            ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`
            })
					}}
				/>}
      </div>
    </div>
  </Dialog>
}
