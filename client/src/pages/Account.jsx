import { useAuth } from "../context/AuthContext";

const Account = () => {
  // 🔹 AuthContext hook (top-level, inside component)
  const { user, logout } = useAuth();

  // Safety check (should rarely happen because route is protected)
  if (!user) return null;

  return (
    <div className="form">
      <h1>Account</h1>

      <p>
        <strong>User ID:</strong> {user.id}
      </p>

      <p>
        <strong>Username:</strong> {user.username}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <button className="loginButton" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Account;
