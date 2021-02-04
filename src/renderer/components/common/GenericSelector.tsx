import React, { useEffect, useMemo, useState } from "react";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { Entity, EVENTS, TableName } from "../../utils/types";
import { ipcRenderer } from "electron";
import { Button, MenuItem } from "@blueprintjs/core";

interface Props<T> {
  table: TableName;
  selected?: number;
  disabled?: boolean;
  params?: any;
  itemName: (entity?: T) => string
  onSelect: (entity?: T) => any
}

export function GenericSelector<T extends Entity>({ table, selected, disabled, params, itemName, onSelect }: Props<T>) {
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<T[]>([]);
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    ipcRenderer.on(EVENTS.RESPONSE_SELECTOR_ITEMS, (event, data) => {
      if (table === data.table) setItems(data.items);
      setLoad(false);
    });
    return () => {
      ipcRenderer.removeAllListeners(EVENTS.RESPONSE_SELECTOR_ITEMS)
    }
  }, [])

  useEffect(() => {
    setLoad(true);
    ipcRenderer.send(EVENTS.REQUEST_SELECTOR_ITEMS, { table, params });
  }, [table])

  useEffect(() => {
    ipcRenderer.send(EVENTS.REQUEST_SELECTOR_ITEMS, { table, params });
  }, [params])

  useEffect(() => {
    if (!load) {
      onSelect(items.find(item => item.id === selected))
    }
  }, [load])

  const filteredItems = useMemo(
    () => {
      return items.filter((item) => itemName(item).toUpperCase().includes(query.toUpperCase())).slice(0, 20)
    }, [items, query]);

  const itemRendered: ItemRenderer<T> = (item, { handleClick, modifiers }) => {
    return (
      <MenuItem
        active={modifiers.active}
        key={item.id}
        onClick={handleClick}
        text={itemName(item)}
        label={`${item.id}`}
      />
    );
  };

  function getName() {
    const item = items.find(item => item.id === selected)
    return item ? itemName(item) : undefined
  }

  return <Select<T>
    items={filteredItems}
    itemRenderer={itemRendered}
    onItemSelect={(item) => onSelect(item)}
    onQueryChange={(query) => setQuery(query)}
    popoverProps={{
      minimal: true,
      targetProps: {
        style: { width: "100%" }
      }
    }}
    disabled={disabled}
  >
    <Button
      fill
      loading={load}
      className={"flex f-jc-between"}
      text={getName()}
      rightIcon="caret-down"
    />
  </Select>
}
