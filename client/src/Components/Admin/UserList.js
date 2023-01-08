import UserEntry from "./UserEntry";

export default function UserList({ userListData, getUsers }) {
  return userListData.map((userEntryData) => (
    <UserEntry
      key={userEntryData._id}
      userEntryData={userEntryData}
      getUsers={getUsers}
    />
  ));
}
