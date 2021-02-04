import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup, NumericInput, TextArea } from "@blueprintjs/core";
import { Auction, AuctionItem, Category } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: AuctionItem,
  onClose: () => any,
  onSave: (entity: AuctionItem) => any
  onUpdate: (entity: AuctionItem) => any
}

export function LotDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<AuctionItem>(entity ?? {
    id: 0,
    lotName: "",
    initial_cost: 0,
    min_increment: 0,
    max_increment: 0,
    current_cost: 0,
    id_auction: 0,
  });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.lotName && obj.min_increment && obj.max_increment && obj.id_auction))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  function handleChangeCost(event: React.ChangeEvent<HTMLInputElement>) {
    const cost = parseInt(event.target.value)
    setObj({
      ...obj,
      initial_cost: cost,
      current_cost: obj.current_cost === obj.initial_cost ? cost : obj.current_cost
    });
  }

  function handleChangeCategoryId(item?: Category) {
    setObj({ ...obj, id_category: item?.id ?? 0 });
  }

  function handleChangeAuctionId(item?: Auction) {
    setObj({ ...obj, id_auction: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение лота" : "Добавление лота"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Наименование">
        <InputGroup
          autoFocus
          id={"lotName"}
          value={obj.lotName}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label="Описание">
        <TextArea
          fill
          growVertically
          id={"description"}
          value={obj.description}
          onChange={handleChanging}
          style={{ resize: "vertical" }}
        />
      </FormGroup>
      <FormGroup label="Начальная стоимость">
        <NumericInput
          fill
          min={0}
          id={"initial_cost"}
          value={obj.initial_cost}
          onChange={handleChangeCost}
        />
      </FormGroup>
      <FormGroup label="Минимальная ставка">
        <NumericInput
          fill
          min={0}
          id={"min_increment"}
          value={obj.min_increment}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label="Максимальная ставка">
        <NumericInput
          fill
          min={0}
          id={"max_increment"}
          value={obj.max_increment}
          onChange={handleChanging}
        />
      </FormGroup>
      <FormGroup label={"Категория лота"}>
        <GenericSelector<Category>
          table={"category"}
          selected={obj.id_category}
          itemName={item => item.categoryName}
          onSelect={handleChangeCategoryId}
        />
      </FormGroup>
      <FormGroup label={"Аукцион"}>
        <GenericSelector<Auction>
          table={"auction"}
          selected={obj.id_auction}
          itemName={item => item.auctionName}
          onSelect={handleChangeAuctionId}
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