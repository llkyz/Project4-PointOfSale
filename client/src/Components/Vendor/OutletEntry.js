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
import config from "../../config";
import Cookies from "js-cookie";

export default function OutletEntry({ data, getOutletList }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditOutletModal, setShowEditOutletModal] = useState(false);
  const [showDeleteOutletModal, setShowDeleteOutletModal] = useState(false);
  const [archiveList, setArchiveList] = useState();
  const [archiveStats, setArchiveStats] = useState();
  const [showChart, setShowChart] = useState("revenue");
  const [fetchDate, setFetchDate] = useState(new Date());

  useEffect(() => {
    if (showDetails) {
      getOutletStats();
    }
    //eslint-disable-next-line
  }, [showDetails, data._id, fetchDate]);

  async function getOutletStats() {
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
      `${config.SERVER}/api/archive/vendor/${data._id}?startDate=${startString}&endDate=${endString}`,
      {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
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
    const res = await fetch(`${config.SERVER}/api/archive/vendor`, {
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
    <>
      <div
        className="adminListGroup"
        style={{
          marginLeft: 0,
          minWidth: "20%",
          width: showDetails ? "100%" : "20%",
        }}
      >
        <div
          className="adminListElement"
          style={{ textAlign: "left" }}
          onClick={toggleShowDetails}
        >
          <div className="adminListArrowContainer">
            <div
              className={
                showDetails ? "adminListArrowOpen" : "adminListArrowClosed"
              }
            />
          </div>
          <div className="adminListUser">{data.username}</div>
        </div>
        {showDetails ? (
          <>
            <div
              style={{
                textAlign: "left",
                marginLeft: "50px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <div
                className="functionSmall"
                style={{ marginRight: "20px" }}
                onClick={toggleChart}
              >
                View {showChart === "orders" ? "Revenue" : "Orders"}
              </div>
              <div
                className="functionSmall"
                style={{ marginRight: "20px" }}
                onClick={() => {
                  setShowEditOutletModal(true);
                }}
              >
                Edit Outlet
              </div>
              <div
                className="functionSmall"
                onClick={() => {
                  setShowDeleteOutletModal(true);
                }}
              >
                Delete Outlet
              </div>
            </div>
            <div style={{ width: "70%", margin: "0 auto" }}>
              <div className="header">
                {showChart === "orders" ? "O R D E R S" : "R E V E N U E"}
              </div>
              <div className="separator" />
              <div className="chartArrowContainer" onClick={chartBack}>
                <div className="chartArrowLeft" />
              </div>
              <div className="chartContainer">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart width={500} height={300} data={archiveStats}>
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
              <div className="header">A R C H I V E</div>
              <div className="separator" />
              {!archiveList || archiveList.length === 0 ? (
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
          </>
        ) : (
          ""
        )}
      </div>
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
