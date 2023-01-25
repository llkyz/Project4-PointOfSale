import { useState, useEffect } from "react";
import NewOutletModal from "./NewOutletModal";
import OutletEntry from "./OutletEntry";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import overview from "../../Assets/overview.png";

export default function OutletOverview() {
  const [outletList, setOutletList] = useState([]);
  const [vendorRevenue, setVendorRevenue] = useState();
  const [vendorOrder, setVendorOrder] = useState();
  const [showChart, setShowChart] = useState("revenue");
  const [showNewOutletModal, setShowNewOutletModal] = useState(false);
  const [fetchDate, setFetchDate] = useState(new Date());

  useEffect(() => {
    getOutletList();
  }, []);

  useEffect(() => {
    getVendorStats();
  }, [fetchDate]);

  async function getOutletList() {
    const res = await fetch("/api/vendor/outlet", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setOutletList(result.data);
    } else {
      console.log(result.data);
    }
  }

  async function getVendorStats() {
    let endDate = new Date(fetchDate.getTime());
    let endString = `${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()}`;

    const res = await fetch(`/api/archive/vendor?endDate=${endString}`, {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setVendorRevenue(result.revenue);
      setVendorOrder(result.order);
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
          <h4>{label}</h4>
          {payload
            ? payload.map((outlet, index) => (
                <p key={index} className="label">{`${outlet.name} : $${(
                  outlet.value / 100
                ).toFixed(2)}`}</p>
              ))
            : ""}
        </div>
      );
    }
    return null;
  }

  function OrderTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip" style={{ padding: "0px 20px" }}>
          <h4>{label}</h4>
          {payload.map((outlet, index) => (
            <p
              key={index}
              className="label"
            >{`${outlet.name} : ${outlet.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
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
        <img src={overview} className="pageImage" alt="overview" />
        <div className="pageTitle">Outlet Overview</div>
      </div>

      <div className="header">
        {showChart === "orders" ? "O R D E R S" : "R E V E N U E"}
      </div>
      <div className="separator" />
      <div
        className="function"
        style={{ margin: "20px 0", display: "block" }}
        onClick={toggleChart}
      >
        View {showChart === "orders" ? "Revenue" : "Orders"}
      </div>
      {vendorRevenue && vendorOrder ? (
        <div>
          <div className="chartArrowContainer" onClick={chartBack}>
            <div className="chartArrowLeft" />
          </div>
          <div className="chartContainer">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={showChart === "orders" ? vendorOrder : vendorRevenue}
              >
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
                {outletList.map((outlet) => (
                  <Bar
                    key={outlet.username}
                    dataKey={outlet.username}
                    fill="#8884d8"
                  />
                ))}
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

      <div className="header">O U T L E T S</div>
      <div className="separator" />
      <div
        className="function"
        style={{ marginTop: "20px", display: "block" }}
        onClick={() => {
          setShowNewOutletModal(true);
        }}
      >
        New Outlet
      </div>
      {outletList.map((data) => (
        <OutletEntry key={data._id} data={data} getOutletList={getOutletList} />
      ))}
      <div style={{ marginBottom: "100px" }} />
      {showNewOutletModal ? (
        <NewOutletModal
          setShowNewOutletModal={setShowNewOutletModal}
          getOutletList={getOutletList}
        />
      ) : (
        ""
      )}
    </div>
  );
}
