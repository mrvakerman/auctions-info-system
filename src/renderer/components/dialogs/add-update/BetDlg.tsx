import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, NumericInput } from "@blueprintjs/core";
import { AuctionItem, AuctionMember, Bet } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: Bet,
  onClose: () => any,
  onSave: (entity: Bet) => any
  onUpdate: (entity: Bet) => any
}

export function BetDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Bet>(entity ?? {
    id: 0,
    cost_increment: 0,
    id_lot: 0,
    id_member: 0
  });
  const [valid, setValid] = useState<boolean>(false);

  const [id_auction, setId] = useState<number>(0);

  const [min, setMin] = useState<number>(0)
  const [max, setMax] = useState<number>(0)

  useEffect(() => {
    setValid(!!(obj.cost_increment && obj.id_lot && obj.id_member))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChangeLotId(item?: AuctionItem) {
    setId(item?.id_auction ?? 0);
    setMin(item?.min_increment ?? 0);
    setMax(item?.max_increment ?? 0);
    setObj({ ...obj, id_lot: item?.id ?? 0 });
  }

  function handleChangeMemberId(item?: AuctionMember) {
    setObj({ ...obj, id_member: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение ставки" : "Добавление ставки"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Ставка">
        <NumericInput
          fill
          autoFocus
          min={min}
          max={max ? max : undefined}
          id={"cost_increment"}
          value={obj.cost_increment}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label={"Лот"}>
        <GenericSelector<AuctionItem>
          table={"auction_lot"}
          selected={obj.id_lot}
          itemName={item => item.lotName}
          onSelect={handleChangeLotId}
        />
      </FormGroup>
      <FormGroup label={"Участник"}>
        <GenericSelector<AuctionMember>
          table={"auction_member"}
          selected={obj.id_member}
          itemName={item => item.fio}
          disabled={!id_auction}
          params={{ id_auction }}
          onSelect={handleChangeMemberId}
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