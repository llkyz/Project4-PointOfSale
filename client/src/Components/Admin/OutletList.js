import { useState, useEffect } from "react";
import OutletEntry from "./OutletEntry";

export default function OutletList({ vendorId }) {
  const [outletList, setOutletList] = useState([]);

  useEffect(() => {
    getOutletList();
  }, []);

  async function getOutletList() {
    const res = await fetch(`/api/admin/outletlist/${vendorId}`, {
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

  return (
    <>
      <h2>Outlets</h2>
      <button onClick={getOutletList}>Refresh</button>
      {outletList.map((data) => {
        return (
          <OutletEntry
            key={data._id}
            data={data}
            getOutletList={getOutletList}
          />
        );
      })}
    </>
  );
}
