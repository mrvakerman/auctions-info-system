import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog, FormGroup, InputGroup, Tooltip } from "@blueprintjs/core";

type Props = {
  onClose: () => any;
  onConfirm: (pass: string) => any;
}

export function ResetPassDlg({ onClose, onConfirm }: Props) {
  const [obj, setObj] = useState<any>({ password: "", repeat: "" });
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [isPasswordR, setIsPasswordR] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(obj.password === obj.repeat)
  }, [obj])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) onConfirm(obj.password)
  }

  function handleChanging(event: React.ChangeEvent<HTMLInputElement>) {
    setObj({ ...obj, [event.target.id]: event.target.value });
  }

  return <Dialog
    isOpen={true}
    onClose={onClose}
    title={"Изменение пароля"}
  >
    <form onSubmit={handleSubmit} className={Classes.DIALOG_BODY}>
      <FormGroup label="Новый пароль">
        <InputGroup
          id={"password"}
          type={isPassword ? "password" : "text"}
          value={obj.password}
          onChange={handleChanging}
          rightElement={
            <Tooltip content={`${isPassword ? "Показать" : "Скрыть"} пароль`}>
              <Button
                icon={isPassword ? "eye-off" : "eye-open"}
                minimal={true}
                onClick={() => setIsPassword(!isPassword)}
              />
            </Tooltip>
          }
        />
      </FormGroup>
      <FormGroup label="Повторите пароль">
        <InputGroup
          id={"repeat"}
          type={isPasswordR ? "password" : "text"}
          value={obj.repeat}
          onChange={handleChanging}
          rightElement={
            <Tooltip content={`${isPasswordR ? "Показать" : "Скрыть"} пароль`}>
              <Button
                icon={isPasswordR ? "eye-off" : "eye-open"}
                minimal={true}
                onClick={() => setIsPasswordR(!isPasswordR)}
              />
            </Tooltip>
          }
        />
      </FormGroup>
    </form>
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button text={"Отмена"} onClick={onClose} />
        <Button
          disabled={!valid}
          intent={"primary"}
          text={"Сохранить"}
          onClick={() => onConfirm(obj.password)}
        />
      </div>
    </div>
  </Dialog>
}
