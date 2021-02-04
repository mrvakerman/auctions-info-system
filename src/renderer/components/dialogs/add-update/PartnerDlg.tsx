import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup } from "@blueprintjs/core";
import { Auctioneer, Partner, WebSite } from "../../../utils/types";
import { GenericSelector } from "../../common/GenericSelector";

type Props = {
  entity?: Partner,
  onClose: () => any,
  onSave: (entity: Partner) => any
  onUpdate: (entity: Partner) => any
}

export function PartnerDlg({ entity, onClose, onSave, onUpdate }: Props) {
  const [obj, setObj] = useState<Partner>(entity ?? { id: 0, id_auctioneer: 0, id_website: 0 });
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(!!(obj.id_auctioneer && obj.id_website))
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) entity ? onUpdate(obj) : onSave(obj)
  }

  function handleChangeAuctioneerId(item: Auctioneer) {
    setObj({ ...obj, id_auctioneer: item.id });
  }

  function handleChangeWebSiteId(item: WebSite) {
    setObj({ ...obj, id_website: item.id });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={entity ? "Изменение партнера" : "Добавление партнера"}
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
      <FormGroup label={"Веб-сайт"}>
        <GenericSelector<WebSite>
          table={"website"}
          selected={obj.id_website}
          itemName={item => item.websiteName}
          onSelect={handleChangeWebSiteId}
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