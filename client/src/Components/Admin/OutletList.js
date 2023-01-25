import { useState, useEffect } from "react";
import OutletEntry from "./OutletEntry";
import refresh from "../../Assets/refresh.png";
import config from "../../../config";

export default function OutletList({ vendorId }) {
  const [outletList, setOutletList] = useState([]);

  useEffect(() => {
    getOutletList();
    //eslint-disable-next-line
  }, []);

  async function getOutletList() {
    const res = await fetch(
      config.SERVER + `/api/admin/outletlist/${vendorId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    let result = await res.json();
    if (res.ok) {
      setOutletList(result.data);
    } else {
      setOutletList([]);
    }
  }

  function refreshList() {
    setOutletList();
    getOutletList();
  }

  return (
    <div style={{ marginLeft: "50px", marginRight: "50px" }}>
      <h2 style={{ marginBottom: 0, display: "inline-block" }}>Outlets</h2>
      <img
        src={refresh}
        style={{
          width: "20px",
          display: "inline-block",
          marginLeft: "10px",
          cursor: "pointer",
        }}
        alt="refresh"
        onClick={refreshList}
      />
      <div className="separator" />
      {outletList ? (
        outletList.length === 0 ? (
          <h3>No outlets</h3>
        ) : (
          outletList.map((data) => {
            return (
              <OutletEntry
                key={data._id}
                data={data}
                getOutletList={getOutletList}
              />
            );
          })
        )
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
}
