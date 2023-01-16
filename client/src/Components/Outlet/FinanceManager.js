import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import ArchiveEntry from "./ArchiveEntry";

export default function FinanceManager() {
  const [archiveList, setArchiveList] = useState([]);
  const [stats, setStats] = useState([])
  const [showChart, setShowChart] = useState('revenue')

  useEffect(() => {
    async function getArchive() {
      let endDate = new Date();
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      let startString = `${startDate.getFullYear()}-${
        startDate.getMonth() + 1
      }-${startDate.getDate()}`;
      let endString = `${endDate.getFullYear()}-${
        endDate.getMonth() + 1
      }-${endDate.getDate()}`;

      const res = await fetch(
        `/api/archive/outlet?startDate=${startString}&endDate=${endString}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      let result = await res.json();
      if (res.ok) {
        result.list.forEach(entry => {
          entry.time = new Date(entry.time)
        });
        setArchiveList(result.list);
        setStats(result.stats)
      } else {
        console.log(result.data);
      }
    }
    getArchive();
  }, []);

  function toggleChart() {
    if (showChart === "orders") {
      setShowChart('revenue')
    } else {
      setShowChart('orders')
    }
  }

  function RevenueTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip" style={{padding: "0px 20px"}}>
          <p className="label">{`Revenue : $${payload ? (payload[0].value/100).toFixed(2) : 0}`}</p>
        </div>
      );
    }
    return null;
  }

  function OrderTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip" style={{padding: "0px 20px"}}>
          <p className="label">{`Orders : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  }

  async function deleteArchive(archiveId, archiveIndex) {
    const res = await fetch(
      `/api/archive/outlet`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archiveId: archiveId }),
      }
    );
    let result = await res.json();
    if (res.ok) {
      let updatedArchive = JSON.parse(JSON.stringify(archiveList))
      updatedArchive.splice(archiveIndex, 1)
      setArchiveList(updatedArchive)
    }
    console.log(result.data);
  }

  return (
    <>
      <h1>Finance Manager</h1>
      <button onClick={toggleChart}>Swap to {showChart === 'orders' ? "Revenue" : "Orders" }</button>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={500} height={300} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={showChart === 'orders' ? <OrderTooltip/> : <RevenueTooltip/>}/>
          <Bar dataKey={showChart} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <h1>Orders</h1>
      {archiveList.length === 0 ? "No archived orders" : 
        archiveList.map((entry, index) => <ArchiveEntry key={index} entry={entry} archiveIndex={index} deleteArchive={deleteArchive}/>)
      }
    </>
  );
}
