import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-600">Admin dashboard — faculty management coming soon.</p>
    </div>
  );
}