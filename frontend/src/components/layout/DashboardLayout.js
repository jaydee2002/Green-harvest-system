import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Settings,
  Store,
  Tags,
  ClipboardList,
} from "lucide-react";
import logo from "../../assets/logo.png";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [openSubmenu, setOpenSubmenu] = useState(new Set()); // Use Set for multiple open submenus
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const current = navItems
      .flatMap((item) => (item.hasDropdown ? [item, ...item.submenu] : item))
      .find((item) => item.path === location.pathname);

    if (current) {
      setSelectedItem(current.label);
    }
  }, [location.pathname]);

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Home,
      active: true,
    },
    {
      label: "Orders",
      path: "/orders",
      icon: ShoppingCart,
    },
    {
      label: "Products",
      path: "/products",
      icon: Package,
      hasDropdown: true,
      submenu: [
        { label: "All Products", path: "/products" },
        { label: "Add Product", path: "/products/add" },
        { label: "Categories", path: "/products/categories" },
      ],
    },
    {
      label: "Customers",
      path: "/customers",
      icon: Users,
      hasDropdown: true,
      submenu: [
        { label: "All Customers", path: "/customers" },
        { label: "New Customers", path: "/customers/new" },
        { label: "Loyal Customers", path: "/customers/loyal" },
      ],
    },
    {
      label: "Store",
      path: "/store",
      icon: Store,
    },
    {
      label: "Coupons",
      path: "/coupons",
      icon: Tags,
    },
    {
      label: "Reports",
      path: "/reports",
      icon: ClipboardList,
      hasDropdown: true,
      submenu: [
        { label: "Sales Report", path: "/reports/sales" },
        { label: "Customer Insights", path: "/reports/customers" },
      ],
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart2,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNavClick = (label) => {
    setSelectedItem(label);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label); // Close submenu if already open
      } else {
        newSet.add(label); // Open submenu
      }
      return newSet;
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic here (e.g., filter navItems or API call)
  };

  return (
    <div className="flex h-screen font-sourceSans bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <img className="w-auto h-8" src={logo} alt="PickMyFood Logo" />
            <span className="text-xl font-bold text-gray-800">PickMyFood</span>
          </div>
          <button
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mt-4">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="search"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full py-2 pl-10 pr-3 text-sm rounded-lg border bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-black focus:ring-black focus:border-black transition duration-200"
              placeholder="Search..."
              aria-label="Search navigation"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.slice(0, 4).map((item) => (
              <div key={item.label}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    handleNavClick(item.label);
                    if (item.hasDropdown) toggleSubmenu(item.label);
                  }}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive || selectedItem === item.label
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                  aria-current={
                    selectedItem === item.label ? "page" : undefined
                  }
                >
                  {item.icon && (
                    <item.icon
                      className={`w-4 h-4 mr-2.5 transition-colors flex-shrink-0 ${
                        selectedItem === item.label
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                  {item.hasDropdown && (
                    <svg
                      className={`w-4 h-4 ml-auto transform transition-transform ${
                        openSubmenu.has(item.label) ? "rotate-180" : ""
                      } ${
                        selectedItem === item.label
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </NavLink>
                {item.hasDropdown && openSubmenu.has(item.label) && (
                  <div className="ml-5 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm rounded-md transition duration-200 ${
                            isActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavClick(subItem.label);
                        }}
                        aria-current={
                          selectedItem === subItem.label ? "page" : undefined
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <hr className="my-4 border-gray-200" />

          <nav className="space-y-1" aria-label="Secondary navigation">
            {navItems.slice(4, 7).map((item) => (
              <div key={item.label}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    handleNavClick(item.label);
                    if (item.hasDropdown) toggleSubmenu(item.label);
                  }}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive || selectedItem === item.label
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                  aria-current={
                    selectedItem === item.label ? "page" : undefined
                  }
                >
                  {item.icon && (
                    <item.icon
                      className={`w-4 h-4 mr-2.5 transition-colors flex-shrink-0 ${
                        selectedItem === item.label
                          ? "text-white group-hover:text-gray-100"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                  {item.hasDropdown && (
                    <svg
                      className={`w-4 h-4 ml-auto transform transition-transform ${
                        openSubmenu.has(item.label) ? "rotate-180" : ""
                      } ${
                        selectedItem === item.label
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </NavLink>
                {item.hasDropdown && openSubmenu.has(item.label) && (
                  <div className="ml-5 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm rounded-md transition duration-200 ${
                            isActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavClick(subItem.label);
                        }}
                        aria-current={
                          selectedItem === subItem.label ? "page" : undefined
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <hr className="my-4 border-gray-200" />

          <nav className="space-y-1" aria-label="Tertiary navigation">
            {navItems.slice(7).map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => handleNavClick(item.label)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive || selectedItem === item.label
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
                aria-current={selectedItem === item.label ? "page" : undefined}
              >
                {item.icon && (
                  <item.icon
                    className={`w-4 h-4 mr-2.5 transition-colors flex-shrink-0 ${
                      selectedItem === item.label
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  />
                )}
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="px-3 py-4 mt-auto border-t border-gray-200">
          <button
            type="button"
            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100"
            aria-label="User profile"
          >
            <img
              className="flex-shrink-0 object-cover w-6 h-6 mr-2.5 rounded-full"
              src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/vertical-menu/2/avatar-male.png"
              alt="User avatar"
            />

            <span className="truncate">Jacob Jones</span>

            <svg
              className="w-4 h-4 ml-auto text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Toggle Button for Mobile */}
        <div className="flex items-center p-3 md:hidden bg-white border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            aria-label="Open sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="ml-3 text-base font-semibold truncate text-gray-800">
            {selectedItem}
          </h1>
        </div>
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto h-full ">
            <div className="h-full overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
