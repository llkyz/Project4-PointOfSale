import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ArchiveEntry from "./ArchiveEntry";
import finance from "../../Assets/finance.png";
import config from "../../config";
import Cookies from "js-cookie";

export default function FinanceManager() {
  const [archiveList, setArchiveList] = useState([]);
  const [stats, setStats] = useState([]);
  const [showChart, setShowChart] = useState("revenue");
  const [fetchDate, setFetchDate] = useState(new Date());

  useEffect(() => {
    getArchive();
    //eslint-disable-next-line
  }, [fetchDate]);

  async function getArchive() {
    let endDate = new Date(fetchDate.getTime());
    let startDate = new Date(fetchDate.getTime());
    startDate.setDate(startDate.getDate() - 180);
    let startString = `${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()}`;
    let endString = `${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()}`;

    const res = await fetch(
      `${config.SERVER}/api/archive/outlet?startDate=${startString}&endDate=${endString}`,
      {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        method: "GET",
        credentials: "include",
      }
    );
    let result = await res.json();
    if (res.ok) {
      result.list.forEach((entry) => {
        entry.time = new Date(entry.time);
      });
      setArchiveList(result.list);
      setStats(result.stats);
    } else {
      console.log(result.data);
    }
  }

  function toggleChart() {
    if (showChart === "orders") {
      setShowChart("revenue");
    } else {
      setShowChart("orders");
    }
  }

  function RevenueTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip" style={{ padding: "0px 20px" }}>
          <p style={{ fontWeight: "bold" }}>{`Revenue : $${
            payload ? (payload[0].value / 100).toFixed(2) : 0
          }`}</p>
        </div>
      );
    }
    return null;
  }

  function OrderTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip" style={{ padding: "0px 20px" }}>
          <p style={{ fontWeight: "bold" }}>{`Orders : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  }

  async function deleteArchive(archiveId, archiveIndex) {
    const res = await fetch(`${config.SERVER}/api/archive/outlet`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ archiveId: archiveId }),
    });
    let result = await res.json();
    if (res.ok) {
      let updatedArchive = JSON.parse(JSON.stringify(archiveList));
      updatedArchive.splice(archiveIndex, 1);
      setArchiveList(updatedArchive);
    }
    console.log(result.data);
  }

  function chartBack() {
    let newDate = new Date(fetchDate.getTime());
    newDate.setDate(newDate.getDate() - 180);
    setFetchDate(newDate);
  }

  function chartForward() {
    let newDate = new Date(fetchDate.getTime());
    newDate.setDate(newDate.getDate() + 180);
    setFetchDate(newDate);
  }

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <div className="pageHeader">
        <img src={finance} className="pageImage" alt="overview" />
        <div className="pageTitle">Finances</div>
      </div>
      <div className="header">
        {showChart === "orders" ? "O R D E R S" : "R E V E N U E"}
      </div>
      <div className="separator" />
      <div
        className="function"
        style={{ display: "block", marginTop: "20px", marginBottom: "20px" }}
        onClick={toggleChart}
      >
        Swap to {showChart === "orders" ? "Revenue" : "Orders"}
      </div>
      {stats && archiveList ? (
        <div>
          <div className="chartArrowContainer" onClick={chartBack}>
            <div className="chartArrowLeft" />
          </div>
          <div className="chartContainer">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart width={500} height={300} data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={
                    showChart === "revenue" ? (value) => value / 100 : ""
                  }
                />
                <Tooltip
                  content={
                    showChart === "orders" ? (
                      <OrderTooltip />
                    ) : (
                      <RevenueTooltip />
                    )
                  }
                />
                <Bar dataKey={showChart} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chartArrowContainer" onClick={chartForward}>
            <div className="chartArrowRight" />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="header">A R C H I V E</div>
      <div className="separator" />
      {archiveList.length === 0 ? (
        <h2>No archived orders</h2>
      ) : (
        <>
          <div className="archiveGrid">
            <div className="archiveGridHeader">Date</div>
            <div className="archiveGridHeader">Table</div>
            <div className="archiveGridHeader">Total</div>
          </div>
          {archiveList.map((entry, index) => (
            <ArchiveEntry
              key={index}
              entry={entry}
              archiveIndex={index}
              deleteArchive={deleteArchive}
            />
          ))}
        </>
      )}
    </div>
  );
}
