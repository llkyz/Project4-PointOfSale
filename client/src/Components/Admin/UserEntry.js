import { useEffect, useState } from "react";
import OutletList from "./OutletList";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

export default function UserEntry({
  userEntryData,
  getUsers,
  userIndex,
  currentOpenUser,
  setCurrentOpenUser,
}) {
  const [showOutletList, setShowOutletList] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  useEffect(() => {
    if (currentOpenUser !== userIndex) {
      setShowOutletList(false);
    }
  }, [currentOpenUser, userIndex]);

  function toggleOutletList() {
    if (showOutletList) {
      setShowOutletList(false);
    } else {
      setShowOutletList(true);
    }
  }

  function toggleDetails() {
    if (currentOpenUser === userIndex) {
      setCurrentOpenUser();
    } else {
      setCurrentOpenUser(userIndex);
    }
  }

  return (
    <div className="adminListGroup" key={userEntryData.username}>
      <div className="adminListElement" onClick={toggleDetails}>
        <div className="adminListArrowContainer">
          <div
            className={
              currentOpenUser === userIndex
                ? "adminListArrowOpen"
                : "adminListArrowClosed"
            }
          />
        </div>
        <div className="adminListUser"> {userEntryData.username}</div>
        <div className="adminListAccess">
          {userEntryData.accessLevel[0].toUpperCase() +
            userEntryData.accessLevel.substring(
              1,
              userEntryData.accessLevel.length
            )}
        </div>
      </div>
      {currentOpenUser === userIndex ? (
        <div className="adminListDetails">
          {userEntryData.accessLevel === "vendor" ? (
            <div
              className="functionSmall"
              style={{ marginRight: "20px" }}
              onClick={() => {
                toggleOutletList();
              }}
            >
              Show Outlets
            </div>
          ) : (
            ""
          )}
          <div
            className="functionSmall"
            style={{ marginRight: "20px" }}
            onClick={() => {
              setShowEditUserModal(true);
            }}
          >
            Edit
          </div>
          <div
            className="functionSmall"
            onClick={() => {
              setShowDeleteUserModal(true);
            }}
          >
            Delete
          </div>
        </div>
      ) : (
        ""
      )}
      {showOutletList ? <OutletList vendorId={userEntryData._id} /> : ""}
      {showEditUserModal ? (
        <EditUserModal
          setShowEditUserModal={setShowEditUserModal}
          userData={userEntryData}
          refreshList={getUsers}
        />
      ) : (
        ""
      )}
      {showDeleteUserModal ? (
        <DeleteUserModal
          setShowDeleteUserModal={setShowDeleteUserModal}
          userData={userEntryData}
          refreshList={getUsers}
        />
      ) : (
        ""
      )}
    </div>
  );
}
