import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { EVENTS } from "../utils/types";
import { Button, ButtonGroup, Menu, MenuItem, Popover, TextArea } from "@blueprintjs/core";
import Papa from "papaparse";
import { ADDITIONAL_QUERIES } from "../../main/queries";

export function GenericQueriesTable() {
  const [query, setQuery] = useState<string>("");
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    ipcRenderer.on(EVENTS.GENERIC_REQUEST, (event, args) => {
      if (Array.isArray(args.items)) {
        args.items[0] && setFields(Object.keys(args.items[0]))
        setRows(args.items);
      } else {
        setQuery("");
      }
    });
    return () => {
      ipcRenderer.removeAllListeners(EVENTS.GENERIC_REQUEST)
    }
  }, [])

  function handleRequest() {
    query && ipcRenderer.send(EVENTS.GENERIC_REQUEST, { query })
  }

  function handleToCSV() {
    const content = Papa.unparse(rows, { columns: fields });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = `exported.csv`;
    a.click();
  }

  function getRows(row: any, i: number, arr: any[]) {
    return <tr key={i}>
      {fields.map(field => (<td key={`${field}${i}`}>{row[field]}</td>))}
    </tr>
  }

  return <>
    <div className={"flex column grow"}>
      <TextArea
        style={{ resize: "vertical", margin: 5, minHeight: 200 }}
        growVertically
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <ButtonGroup
        large
        className={"fill-btn"}
      >
        <Button
          fill
          intent={"primary"}
          onClick={handleRequest}
          text={"Отправить запрос"}
        />
        <Popover
          fill
          content={<Menu>
            <MenuItem text={"Прибыль за период на торг дом"} onClick={() => {
              setQuery(ADDITIONAL_QUERIES[0])
            }}/>
            <MenuItem text={"Самый дорогой и дешевый лот"} onClick={() => {
              setQuery(ADDITIONAL_QUERIES[1])
            }}/>
            <MenuItem text={"Лоты на торгах по категории и сортировка по названию"} onClick={() => {
              setQuery(ADDITIONAL_QUERIES[2])
            }}/>
            <MenuItem text={"Количество непроданных лотов"} onClick={() => {
              setQuery(ADDITIONAL_QUERIES[3])
            }}/>
            <MenuItem text={"Лоты, имеющие стоимость ниже средней"} onClick={() => {
              setQuery(ADDITIONAL_QUERIES[4])
            }}/>
          </Menu>}
          position={"bottom"}
        >
          <Button
            fill
            intent={"primary"}
            text={"Готовые запросы"}
          />
        </Popover>
        {rows.length
          ? <Button
            fill
            intent={"success"}
            onClick={handleToCSV}
            text={"экспортировать в CSV"}
          />
          : null
        }
      </ButtonGroup>

      <table className={"generic-table"}>
        <thead>
        <tr>
          {fields.map(field => (<th key={field} className={"ta-start"}>{field}</th>))}
        </tr>
        </thead>
        <tbody>
        {rows.map(getRows)}
        </tbody>
      </table>
    </div>
  </>
}
