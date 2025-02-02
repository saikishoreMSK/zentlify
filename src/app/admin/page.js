"use client";
import { useState } from "react";
import AddProduct from "./AddProduct/page"; // Import your AddProduct component
import ManageProducts from "./ManageProducts/page"; // Import your ManageProducts component
import './admin.css';

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("addProduct"); // State to track the active component

  return (
    <div className="admin-panel">
      {/* Navbar */}
      <div className="navbar">
        <button
          className={activeComponent === "addProduct" ? "active" : ""}
          onClick={() => setActiveComponent("addProduct")}
        >
          Add Products
        </button>
        <button
          className={activeComponent === "manageProducts" ? "active" : ""}
          onClick={() => setActiveComponent("manageProducts")}
        >
          Manage Products
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeComponent === "addProduct" && <AddProduct />}
        {activeComponent === "manageProducts" && <ManageProducts />}
      </div>
    </div>
  );
};

export default AdminPage;
