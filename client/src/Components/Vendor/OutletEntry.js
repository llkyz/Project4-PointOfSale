import { useState, useEffect } from "react";
import DeleteOutletModal from "./DeleteOutletModal";
import EditOutletModal from "./EditOutletModal";
import ArchiveEntry from "../Outlet/ArchiveEntry";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OutletEntry({ data, getOutletList }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditOutletModal, setShowEditOutletModal] = useState(false);
  const [showDeleteOutletModal, setShowDeleteOutletModal] = useState(false);
  const [archiveList, setArchiveList] = useState();
  const [archiveStats, setArchiveStats] = useState();
  const [showChart, setShowChart] = useState("revenue");

  useEffect(() => {
    async function getOutletStats() {
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
        `/api/archive/vendor/${data._id}?startDate=${startString}&endDate=${endString}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      let result = await res.json();
      if (res.ok) {
        setArchiveList(result.list);
        setArchiveStats(result.stats);
      } else {
        console.log(result.data);
      }
    }

    if (showDetails) {
      getOutletStats();
    }
  }, [showDetails]);

  function toggleShowDetails() {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
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
          <p className="label">{`Revenue : $${
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
          <p className="label">{`Orders : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  }

  async function deleteArchive(archiveId, archiveIndex) {
    const res = await fetch(`/api/archive/vendor`, {
      method: "DELETE",
      credentials: "include",
      headers: {
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

  return (
    <>
      <h2>Outlet</h2>
      <p>{data.username}</p>
      <button onClick={toggleShowDetails}>Show Details</button>
      {showDetails ? (
        <>
          <button
            onClick={() => {
              setShowEditOutletModal(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowDeleteOutletModal(true);
            }}
          >
            Delete
          </button>
          <button onClick={toggleChart}>
            Swap to {showChart === "orders" ? "Revenue" : "Orders"}
          </button>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart width={500} height={300} data={archiveStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                content={
                  showChart === "orders" ? <OrderTooltip /> : <RevenueTooltip />
                }
              />
              <Bar dataKey={showChart} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <h1>Orders</h1>
          {!archiveList || archiveList.length === 0
            ? "No archived orders"
            : archiveList.map((entry, index) => (
                <ArchiveEntry
                  key={index}
                  entry={entry}
                  archiveIndex={index}
                  deleteArchive={deleteArchive}
                />
              ))}
        </>
      ) : (
        ""
      )}
      {showEditOutletModal ? (
        <EditOutletModal
          userData={data}
          setShowEditOutletModal={setShowEditOutletModal}
          getOutletList={getOutletList}
        />
      ) : (
        ""
      )}
      {showDeleteOutletModal ? (
        <DeleteOutletModal
          userData={data}
          setShowDeleteOutletModal={setShowDeleteOutletModal}
          getOutletList={getOutletList}
        />
      ) : (
        ""
      )}
    </>
  );
}
