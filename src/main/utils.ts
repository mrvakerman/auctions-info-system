import { Entity, TableName } from "../renderer/utils/types";

function fixStr(value: any) {
  return typeof value === "string" ? `"${value}"` : value
}

export function getAddQuery(table: TableName, entity: Entity) {
  const query = `insert into ${table} (${
    Object.keys(entity).join(", ")
  }) value (${
    Object.values(entity).map(value => fixStr(value)).join(", ")
  })`;
  console.log(query);
  return query;
}

export function getUpdateQuery(table: TableName, entity: Entity) {
  const query = `update ${table} set ${
    Object.entries(entity).map(([key, value]) => `${key} = ${fixStr(value)}`).join(", ")
  } where id = ${entity.id}`;
  console.log(query);
  return query;
}

export function getDeleteQuery(table: TableName, entities: Entity[]) {
  const query = `delete from ${table} where id in (${entities.map(entity => entity.id).join(", ")})`;
  console.log(query);
  return query;
}

export function getFilter(params: any) {
  if (!params) return "";
  return Object.entries(params)
    .reduce((acc, [key, value]) => `${acc} ${key} = ${fixStr(value)} and`, " where")
    .replace(/ and$/, "")
}