// layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-page">
      <Outlet />
    </div>
  );
};

export default AdminLayout;