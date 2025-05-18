"use client";
import { redirect } from "next/navigation";
import { url } from "node:inspector/promises";
// components/Sidebar.js
import { useState } from "react";
import {
  FiHome,
  FiBook,
  FiLayers,
  FiFileText,
  FiHeart,
  FiVideo,
  FiUsers,
  FiMessageSquare,
  FiUser,
  FiBell,
  FiSettings,
  FiShoppingBag,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = [
    { name: "Home", icon: <FiHome />, url: "/protected/dashboard/home" },
    { name: "Study", icon: <FiBook />, url: "/protected/dashboard/study" },
    {
      name: "Courses",
      icon: <FiLayers />,
      url: "/protected/dashboard/courses",
    },
    { name: "Exam", icon: <FiFileText />, url: "/protected/dashboard/exam" },
    {
      name: "Wishlist",
      icon: <FiHeart />,
      url: "/protected/dashboard/wishlist",
    },
    {
      name: "Online Class",
      icon: <FiVideo />,
      url: "/protected/dashboard/online-class",
    },
    {
      name: "Instructors",
      icon: <FiUsers />,
      url: "/protected/dashboard/instructors",
    },
    {
      name: "Chat",
      icon: <FiMessageSquare />,
      url: "/protected/dashboard/chat",
    },
    { name: "Profile", icon: <FiUser />, url: "/protected/dashboard/profile" },
    {
      name: "Notification",
      icon: <FiBell />,
      url: "/protected/dashboard/notification",
    },
    {
      name: "Settings",
      icon: <FiSettings />,
      url: "/protected/dashboard/settings",
    },
    {
      name: "Purchase History",
      icon: <FiShoppingBag />,
      url: "/protected/dashboard/purchase-history",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`flex flex-col h-screen shadow-lg transition-all duration-300 bg-primary ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-xl font-bold text-blue-600">ElimuXR</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => redirect(item.url)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeItem === item.name ? "bg-blue-50 text-blue-600" : " hover:bg-gray-100"}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => console.log("Logout")} // Replace with your logout function
            className={`flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 ${collapsed ? "justify-center" : ""}`}
          >
            <FiLogOut className="text-lg" />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Sidebar Footer */}
    </div>
  );
};

export default Sidebar;
