import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { Auction, Auctioneer, City, Country, EVENTS } from "../utils/types";
import { Button, FormGroup } from "@blueprintjs/core";
import { GenericSelector } from "./common/GenericSelector";

type Props = {
  connected: boolean
}

export function Main({ connected }: Props) {
  const [isDaily, showDaily] = useState<boolean>(false);
  const [daily, setDaily] = useState<Auction[]>([]);
  const [dailyF, setDailyF] = useState<Auction[]>([]);

  const [isWeekly, showWeekly] = useState<boolean>(false);
  const [weekly, setWeekly] = useState<Auction[]>([]);
  const [weeklyF, setWeeklyF] = useState<Auction[]>([]);

  const [isMonthly, showMonthly] = useState<boolean>(false);
  const [monthly, setMonthly] = useState<Auction[]>([]);
  const [monthlyF, setMonthlyF] = useState<Auction[]>([]);

  const [lots, setLots] = useState<any[]>([]);

  const [country, setCountry] = useState<Country>();
  const [city, setCity] = useState<City>();
  const [auctioneer, setAuctioneer] = useState<Auctioneer>()

  useEffect(() => {
    ipcRenderer.on(EVENTS.DAILY_AUCTIONS, (event, args) => {
      if (args.items && args.items.length) showDaily(true);
      setDaily(args.items)
    })
    ipcRenderer.on(EVENTS.WEEKLY_AUCTIONS, (event, args) => {
      if (args.items && args.items.length) showWeekly(true);
      setWeekly(args.items)
    })
    ipcRenderer.on(EVENTS.MONTHLY_AUCTIONS, (event, args) => {
      if (args.items && args.items.length) showMonthly(true);
      setMonthly(args.items)
    })
    ipcRenderer.on(EVENTS.GENERIC_REQUEST, (event, args) => {
      setLots(args.items);
    })
    return () => {
      ipcRenderer.removeAllListeners(EVENTS.DAILY_AUCTIONS)
      ipcRenderer.removeAllListeners(EVENTS.WEEKLY_AUCTIONS)
      ipcRenderer.removeAllListeners(EVENTS.MONTHLY_AUCTIONS)
      ipcRenderer.removeAllListeners(EVENTS.GENERIC_REQUEST)
    }
  }, [])

  useEffect(() => {
    if (connected) {
      ipcRenderer.send(EVENTS.DAILY_AUCTIONS)
      ipcRenderer.send(EVENTS.WEEKLY_AUCTIONS)
      ipcRenderer.send(EVENTS.MONTHLY_AUCTIONS)
    }
  }, [connected])

  useEffect(() => {
    setDailyF(daily.filter((item: any) => {
      if (country && item.id_country !== country.id) return false
      if (city && item.id_city !== city.id) return false
      return !(auctioneer && item.id_auctioneer !== auctioneer.id);
    }));
    setWeeklyF(weekly.filter((item: any) => {
      if (country && item.id_country !== country.id) return false
      if (city && item.id_city !== city.id) return false
      return !(auctioneer && item.id_auctioneer !== auctioneer.id);
    }));
    setMonthlyF(monthly.filter((item: any) => {
      if (country && item.id_country !== country.id) return false
      if (city && item.id_city !== city.id) return false
      return !(auctioneer && item.id_auctioneer !== auctioneer.id);
    }));
  }, [daily, weekly, monthly, country, city, auctioneer])

  function getAuctionRow(item: Auction, index: number, items: Auction[]) {
    const date = new Date(item.start_date);
    return <tr key={item.id} onClick={() => getLots(item.id)}>
      <td className={"center"} style={{ width: 200 }}>
        {`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}
      </td>
      <td>{item.auctionName}</td>
    </tr>
  }

  function getLots(id: number) {
    ipcRenderer.send(EVENTS.GENERIC_REQUEST, { query: `select * from auction_lot where id_auction = ${id}` })
  }

  return <div className={"flex row grow"} style={{ maxHeight: "calc(100% - 50px)" }}>
    <div className={"actions-container"} style={{ justifyContent: "flex-start" }}>
      <h3 style={{ textAlign: "center" }}>Фильтры:</h3>
      {connected
        ? <>
          <FormGroup label={"Страна"}>
            <GenericSelector<Country>
              table={"country"}
              itemName={item => item.countryName}
              selected={country ? country.id : undefined}
              onSelect={setCountry}
            />
          </FormGroup>
          <FormGroup label={"Город"}>
            <GenericSelector<City>
              table={"city"}
              itemName={item => item.cityName}
              selected={city ? city.id : undefined}
              onSelect={setCity}
              params={country ? { id_country: country.id } : undefined}
            />
          </FormGroup>
          <FormGroup label={"Аукционер"}>
            <GenericSelector<Auctioneer>
              table={"auctioneer"}
              itemName={item => item.auctioneerName}
              selected={auctioneer ? auctioneer.id : undefined}
              onSelect={setAuctioneer}
              params={city ? { id_city: city.id } : undefined}
            />
          </FormGroup>
        </>
        : undefined
      }
    </div>
    <div className={"flex column grow"} style={{ overflowY: "auto" }}>
      <div className={`flex column ${isDaily ? "grow" : ""}`}>
        <Button
          large
          text={"Сегодня"}
          onClick={() => showDaily(!isDaily)}
          style={{ position: "sticky", top: 0 }}
        />
        {isDaily && <div className={"flex grow"}>
					<table className={"generic-table"}>
						<tbody>
            {dailyF.length
              ? dailyF.map(getAuctionRow)
              : <tr>
                <td className={"center"}>Аукционы не найдены</td>
              </tr>
            }
						</tbody>
					</table>
				</div>}
      </div>
      <div className={`flex column ${isWeekly ? "grow" : ""}`}>
        <Button
          large
          text={"На этой неделе"}
          onClick={() => showWeekly(!isWeekly)}
          style={{ position: "sticky", top: 0 }}
        />
        {isWeekly && <div className={"flex grow"}>
					<table className={"generic-table"}>
						<tbody>
            {weeklyF.length
              ? weeklyF.map(getAuctionRow)
              : <tr>
                <td className={"center"}>Аукционы не найдены</td>
              </tr>
            }
						</tbody>
					</table>
				</div>}
      </div>
      <div className={`flex column ${isMonthly ? "grow" : ""}`}>
        <Button
          large
          text={"В этом месяце"}
          onClick={() => showMonthly(!isMonthly)}
          style={{ position: "sticky", top: 0 }}
        />
        {isMonthly && <div className={"flex grow"}>
					<table className={"generic-table"}>
						<tbody>
            {monthlyF.length
              ? monthlyF.map(getAuctionRow)
              : <tr>
                <td className={"center"}>Аукционы не найдены</td>
              </tr>
            }
						</tbody>
					</table>
				</div>}
      </div>
    </div>
    <div className={"actions-container"} style={{ justifyContent: "flex-start" }}>
      <h3 style={{ textAlign: "center" }}>Лоты:</h3>
      {lots.map(lot => (<Button key={lot.id} text={`${lot.lotName} (${lot.current_cost})`} />))}
    </div>
  </div>
}
