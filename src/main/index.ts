import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";
import { format as formatUrl } from "url";
import { ConnectionParams, EVENTS, TableName } from "../renderer/utils/types";
import { getAddQuery, getDeleteQuery, getFilter, getUpdateQuery } from "./utils";
import { MAIN, SCHEMA, SELECTOR_ITEMS } from "./queries";

const mysql = require("mysql2");

const isDevelopment = process.env.NODE_ENV !== "production";
const menuTemplate: (
  | Electron.MenuItemConstructorOptions
  | Electron.MenuItem
  )[] = [];

let connection: any = null;
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  const window = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true }
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

function sendError(window: BrowserWindow, err: string) {
  window.webContents.send(EVENTS.ERROR, err);
}

function sendSuccessChanging(window: BrowserWindow, table: TableName) {
  window.webContents.send(EVENTS.CHANGING_SUCCESSFUL, table);
}

if (isDevelopment) {
  menuTemplate.push({
    label: "dev",
    submenu: [
      {
        label: "Перезагрузить окно",
        click(item, win) {
          win.reload();
        }
      },
      {
        label: "Открыть DevTools",
        click(item, win) {
          win.webContents.openDevTools();
        }
      }
    ]
  });
}

Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

app.on("window-all-closed", () => (process.platform !== "darwin") && app.quit());

app.on("activate", () => !mainWindow && (mainWindow = createMainWindow()));

app.on("ready", () => mainWindow = createMainWindow());

ipcMain.on(EVENTS.CREATE_CONNECTION, (event, params: ConnectionParams) => {
  connection = mysql.createConnection({ ...params });
  connection.connect((err: any) => {
    if (err) {
      sendError(mainWindow, "Ошибка подключения: " + err.message)
    } else {
      mainWindow.webContents.send(EVENTS.CONNECTION_SUCCESSFUL, params)
    }
  })
})

ipcMain.on(EVENTS.DAILY_AUCTIONS, () => {
  if (connection) {
    connection.query(
      MAIN.daily,
      (err: any, results: any[]) => {
        if (err) {
          mainWindow.webContents.send(EVENTS.DAILY_AUCTIONS, { items: [] })
        } else {
          mainWindow.webContents.send(EVENTS.DAILY_AUCTIONS, { items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.WEEKLY_AUCTIONS, () => {
  if (connection) {
    connection.query(
      MAIN.weekly,
      (err: any, results: any[]) => {
        if (err) {
          mainWindow.webContents.send(EVENTS.WEEKLY_AUCTIONS, { items: [] })
        } else {
          mainWindow.webContents.send(EVENTS.WEEKLY_AUCTIONS, { items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.MONTHLY_AUCTIONS, () => {
  if (connection) {
    connection.query(
      MAIN.monthly,
      (err: any, results: any[]) => {
        if (err) {
          mainWindow.webContents.send(EVENTS.MONTHLY_AUCTIONS, { items: [] })
        } else {
          mainWindow.webContents.send(EVENTS.MONTHLY_AUCTIONS, { items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.REQUEST_USER, (event, args) => {
  if (connection) {
    connection.query(
      `select host, db as "database", user, select_priv as "isSelect", insert_priv as "isInsert", update_priv as "isUpdate", delete_priv as "isDelete" 
      from mysql.db where db = "${args.database}" and user = "${args.user}"`,
      (err: any, results: any[]) => {
        if (err) {
          mainWindow.webContents.send(EVENTS.REQUEST_USER, { items: [args] })
        } else {
          mainWindow.webContents.send(EVENTS.REQUEST_USER, { items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.REQUEST_USERS, (event, args) => {
  if (connection) {
    connection.query(
      `select host, db as "database", user, select_priv as "isSelect", insert_priv as "isInsert", update_priv as "isUpdate", delete_priv as "isDelete" 
      from mysql.db where db = "${args.database}"`,
      (err: any, results: any[]) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          mainWindow.webContents.send(EVENTS.RESPONSE_USERS, { items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.CREATE_USER, (event, args) => {
  if (connection) {
    connection.query(
      `CREATE USER '${args.user}'@'${args.host}' IDENTIFIED BY '${args.password}'`,
      (err: any) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          let grants = [];
          if (args.isSelect === "Y") grants.push("SELECT")
          if (args.isInsert === "Y") grants.push("INSERT")
          if (args.isUpdate === "Y") grants.push("UPDATE")
          if (args.isDelete === "Y") grants.push("DELETE")
          connection.query(
            `GRANT ${grants.join(", ")} ON ${args.database}.* TO '${args.user}'@'${args.host}'`,
            (err: any) => {
              if (err) {
                sendError(mainWindow, err.toString())
              } else connection.query("FLUSH PRIVILEGES", () => mainWindow.webContents.send(EVENTS.CREATE_USER))
            }
          )
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.CHANGE_PRIVS, (event, args) => {
  if (connection) {
    connection.query(
      `REVOKE ALL ON ${args.database}.* FROM '${args.user}'@'${args.host}'`,
      (err: any) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          connection.query("FLUSH PRIVILEGES", () => {
            let grants = [];
            if (args.isSelect === "Y") grants.push("SELECT")
            if (args.isInsert === "Y") grants.push("INSERT")
            if (args.isUpdate === "Y") grants.push("UPDATE")
            if (args.isDelete === "Y") grants.push("DELETE")
            connection.query(
              `GRANT ${grants.join(", ")} ON ${args.database}.* TO '${args.user}'@'${args.host}'`,
              (err: any) => {
                if (err) {
                  sendError(mainWindow, err.toString())
                } else connection.query("FLUSH PRIVILEGES", () => mainWindow.webContents.send(EVENTS.CHANGE_PRIVS))
              }
            )
          })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.RESET_PASS, (event, args) => {
  if (connection) {
    connection.query(
      `ALTER USER '${args.user}'@'${args.host}' IDENTIFIED BY '${args.password}'`,
      (err: any) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          mainWindow.webContents.send(EVENTS.RESET_PASS)
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.DELETE_USER, (event, args) => {
  if (connection) {
    connection.query(
      `DROP USER '${args.user}'@'${args.host}'`,
      (err: any) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          mainWindow.webContents.send(EVENTS.DELETE_USER)
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.REQUEST_DATA, (event, table) => {
  if (connection) {
    console.log(table);
    connection.query(
      `select * from ${table}`,
      (err: any, results: any[]) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          mainWindow.webContents.send(EVENTS.RESPONSE_DATA, { items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.REQUEST_SELECTOR_ITEMS, (event, data) => {
  if (connection) {
    // @ts-ignore
    const query = `${SELECTOR_ITEMS[data.table]}${getFilter(data.params)} order by id asc`;
    console.log(query);
    connection.query(
      query,
      (err: any, results: any[]) => {
        if (err) {
          sendError(mainWindow, err.toString())
          mainWindow.webContents.send(EVENTS.RESPONSE_SELECTOR_ITEMS, { table: data.table, items: [] })
        } else {
          mainWindow.webContents.send(EVENTS.RESPONSE_SELECTOR_ITEMS, { table: data.table, items: results })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

function handleChanging(err: any, result: any, table: TableName) {
  if (err) {
    console.error(err);
    sendError(mainWindow, err.toString())
  } else {
    console.log(result);
    sendSuccessChanging(mainWindow, table)
  }
}

ipcMain.on(EVENTS.ADD_ENTITY, (event, params) => {
  if (connection) {
    connection.query(
      getAddQuery(params.table, params.entity),
      (err: any, res: any) => handleChanging(err, res, params.table)
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.UPDATE_ENTITY, (event, params) => {
  if (connection) {
    connection.query(
      getUpdateQuery(params.table, params.entity),
      (err: any, res: any) => handleChanging(err, res, params.table)
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.DELETE_ENTITIES, (event, params) => {
  if (connection) {
    connection.query(
      getDeleteQuery(params.table, params.entities),
      (err: any, res: any) => handleChanging(err, res, params.table)
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})

ipcMain.on(EVENTS.USER_CHANGE, () => {
  connection = undefined;
  mainWindow.reload();
})

ipcMain.on(EVENTS.LOG_OUT, () => (process.platform !== "darwin") && app.quit())

ipcMain.on(EVENTS.GENERIC_REQUEST, (event, args) => {
  if (connection) {
    connection.query(
      args.query,
      (err: any, res: any) => {
        if (err) {
          sendError(mainWindow, err.toString())
        } else {
          mainWindow.webContents.send(EVENTS.GENERIC_REQUEST, { items: res })
        }
      }
    )
  } else {
    sendError(mainWindow, "Отсутствует соединение с базой данных!")
  }
})
