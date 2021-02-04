import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup } from "@blueprintjs/core";
import { Auction, AuctionMember, Person } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: AuctionMember,
  onClose: () => any,
  onSave: (entity: AuctionMember) => any
  onUpdate: (entity: AuctionMember) => any
}

export function MemberDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<AuctionMember>(entity ?? { id: 0, id_auction: 0, id_person: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.id_auction && obj.id_person))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChangeAuctionId(item?: Auction) {
    setObj({ ...obj, id_auction: item?.id ?? 0 });
  }

  function handleChangePersonId(item?: Person) {
    setObj({ ...obj, id_person: item?.id ?? 0 });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение участника" : "Добавление участника"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label={"Аукцион"}>
        <GenericSelector<Auction>
          table={"auction"}
          selected={obj.id_auction}
          itemName={item => item.auctionName}
          onSelect={handleChangeAuctionId}
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