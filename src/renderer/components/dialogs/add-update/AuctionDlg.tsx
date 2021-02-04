import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { Auction, Auctioneer, AuctionType } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";
import { DateInput } from "@blueprintjs/datetime";

type Props = {
  entity?: Auction,
  onClose: () => any,
  onSave: (entity: Auction) => any
  onUpdate: (entity: Auction) => any
}

export function AuctionDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Auction>(entity ?? {
    id: 0,
    auctionName: "",
    start_date: `${new Date()}`,
    id_type: 0,
    id_auctioneer: 0
  });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.auctionName && obj.start_date && obj.id_type && obj.id_auctioneer))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChangeTypeId(item?: AuctionType) {
    setObj({ ...obj, id_type: item?.id ?? 0 });
  }

  function handleChangeAuctioneerId(item?: Auctioneer) {
    setObj({ ...obj, id_auctioneer: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение аукциона" : "Добавление аукциона"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Наименование">
        <InputGroup
          autoFocus
          id={"auctionName"}
          value={obj.auctionName}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label={"Дата начала"}>
        <DateInput
          fill
          minDate={new Date()}
          formatDate={date => date.toLocaleString()}
          value={new Date(obj.start_date)}
          onChange={start_date => setObj({
            ...obj,
            start_date: start_date.toString()
          })}
          parseDate={str => new Date(str)}
          timePrecision={"minute"}
        />
      </FormGroup>
      <FormGroup label={"Тип аукциона"}>
        <GenericSelector<AuctionType>
          table={"auction_type"}
          selected={obj.id_type}
          itemName={item => item.typeName}
          onSelect={handleChangeTypeId}
        />
      </FormGroup>
      <FormGroup label={"Аукционер"}>
        <GenericSelector<Auctioneer>
          table={"auctioneer"}
          selected={obj.id_auctioneer}
          itemName={item => item.auctioneerName}
          onSelect={handleChangeAuctioneerId}
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
            const date = new Date(obj.start_date);
            onSave({
              ...obj, start_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
            ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`
            })
          }}
				/>}
        {entity && <Button
					disabled={!valid}
					intent={"primary"}
					text={"Редактировать"}
					onClick={() => {
            const date = new Date(obj.start_date);
            onUpdate({
              ...obj, start_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
            ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`
            })
          }}
				/>}
      </div>
    </div>
  </Dialog>
}
