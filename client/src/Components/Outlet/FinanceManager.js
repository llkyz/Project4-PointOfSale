import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function FinanceManager() {
  const [archiveList, setArchiveList] = useState([]);

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
        setArchiveList(result.list);
      } else {
        console.log(result.data);
      }
    }
    getArchive();
  }, []);

  return (
    <>
      <h1>Finance Manager</h1>
      <p>{JSON.stringify(archiveList)}</p>
    </>
  );
}
