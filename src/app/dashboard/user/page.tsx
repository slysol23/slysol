'use client';

import React, { useEffect, useState } from 'react';
import { IUser } from 'lib/type';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { user } from 'lib/user';

export default function UsersDashboardPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await user.getAll(); // assumes user API returns { data: IUser[] }
      setUsers(res?.data || []);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await user.delete(id);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Users</h1>
        <Link
          href="/dashboard/user/add"
          className="bg-blue px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
        >
          <FaPlus /> Add User
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300 border border-gray-700 rounded-lg">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Admin</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-700 text-black hover:bg-gray-400 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.isAdmin ? 'Yes' : 'No'}</td>
                  <td className="p-3 flex gap-3 justify-center">
                    <button
                      onClick={() => handleDelete(Number(u.id))}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
