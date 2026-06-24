"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Users() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/users`, { headers: { token } });
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, backendUrl]);

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const res = await axios.put(`${backendUrl}/api/admin/user/role`, { userId, role: newRole }, { headers: { token } });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        toast.success(`User role updated to ${newRole}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Reward Points</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-4 font-bold">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                    user.role === 'shopkeeper' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'delivery' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-green-600 font-bold">{user.rewardPoints || 0}</td>
                <td className="p-4 flex gap-2">
                  <select 
                    value={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white outline-none"
                  >
                    <option value="user">User</option>
                    <option value="shopkeeper">Shopkeeper</option>
                    <option value="delivery">Delivery</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
