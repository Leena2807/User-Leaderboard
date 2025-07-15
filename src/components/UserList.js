import React, { useState, useEffect } from "react";
import { fetchUsers, addUser, claimPoints } from "../api";

const UserList = ({ onPointsClaimed }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newUserName, setNewUserName] = useState("");

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUserName.trim() === "") return;
    await addUser(newUserName);
    setNewUserName("");
    loadUsers();
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) return;
    await claimPoints(selectedUser);
    onPointsClaimed();
    loadUsers();
  };

  return (
    <div>
      <h2>User List</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={handleClaimPoints}>Claim Points</button>
      <div>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Add new user"
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
    </div>
  );
};

export default UserList;