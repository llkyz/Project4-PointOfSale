import { useState, useEffect } from "react";
import NewOutletModal from "./NewOutletModal";
import OutletEntry from "./OutletEntry";

export default function OutletOverview() {
  const [outletList, setOutletList] = useState([]);
  const [showNewOutletModal, setShowNewOutletModal] = useState(false);

  useEffect(() => {
    getOutletList();
  }, []);

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

  return (
    <>
      <h1>Overview</h1>
      <button
        onClick={() => {
          setShowNewOutletModal(true);
        }}
      >
        New Outlet
      </button>
      {outletList.map((data) => (
        <OutletEntry key={data._id} data={data} getOutletList={getOutletList} />
      ))}
      {showNewOutletModal ? (
        <NewOutletModal
          setShowNewOutletModal={setShowNewOutletModal}
          getOutletList={getOutletList}
        />
      ) : (
        ""
      )}
    </>
  );
}
