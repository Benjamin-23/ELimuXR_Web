"use client";
import { signOutAction } from "@/app/actions";
import { redirect, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { name: "Home", icon: <FiHome />, url: "/protected/dashboard" },
    { name: "Study", icon: <FiBook />, url: "/protected/dashboard/study" },
    { name: "Courses", icon: <FiLayers />, url: "/dashboard/courses" },
    { name: "Exam", icon: <FiFileText />, url: "/dashboard/exam" },
    { name: "Wishlist", icon: <FiHeart />, url: "/dashboard/wishlist" },
    {
      name: "Online Class",
      icon: <FiVideo />,
      url: "/protected/dashboard/online-class",
    },
    { name: "Instructors", icon: <FiUsers />, url: "/dashboard/instructors" },
    { name: "Chat", icon: <FiMessageSquare />, url: "/dashboard/chat" },
    { name: "Profile", icon: <FiUser />, url: "/dashboard/profile" },
    { name: "Notification", icon: <FiBell />, url: "/dashboard/notification" },
    { name: "Settings", icon: <FiSettings />, url: "/dashboard/settings" },
    {
      name: "Purchase History",
      icon: <FiShoppingBag />,
      url: "/dashboard/purchase-history",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (item: any) => {
    // Only allow navigation for specific items
    if (!["Home", "Online Class"].includes(item.name)) {
      return;
    }
    setActiveItem(item.name);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    redirect(item.url);
  };

  const isProtected = pathname?.includes("/protected/");

  // For mobile view
  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary shadow-md"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div
          className={`fixed inset-0 bg-background z-40 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-4 border-b">
              <a href="/protected" className="text-xl font-bold text-primary">
                ElimuXR
              </a>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="mt-6">
                <ul className="space-y-2 px-4">
                  {menuItems.map((item) => {
                    const isDisabled = !["Home", "Online Class"].includes(
                      item.name,
                    );
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item)}
                          disabled={isDisabled}
                          className={`flex items-center w-full p-4 rounded-lg transition-colors ${
                            activeItem === item.name
                              ? "bg-muted text-primary"
                              : isDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-muted"
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="ml-3 font-medium">{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {isProtected && (
                <div className="p-4 border-t mt-6">
                  <button
                    onClick={() => signOutAction()}
                    className="flex items-center w-full p-2 rounded-lg bg-primary hover:bg-primary"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="ml-3 font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // For desktop view
  return (
    <div
      className={`flex flex-col h-screen shadow-lg transition-all duration-300 bg-muted ${
        collapsed ? "w-20" : "w-fit"
      }`}
    >
      <div className="flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <a href="/protected" className="text-xl font-bold text-primary">
            ElimuXR
          </a>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => {
              const isDisabled = !["Home", "Online Class"].includes(item.name);
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item)}
                    disabled={isDisabled}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      activeItem === item.name
                        ? "bg-muted-foreground text-primary"
                        : isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {isProtected && (
          <div className="p-4 border-t">
            <button
              onClick={() => signOutAction()}
              className={`flex items-center w-full p-3 rounded-lg bg-background hover:bg-background ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <FiLogOut className="text-lg" />
              {!collapsed && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
