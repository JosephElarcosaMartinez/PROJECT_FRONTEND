import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import {LayoutDashboard, User, Folder, ListTodo, FileText, Archive, AreaChart , Bell, Clock,} from "lucide-react";

import light_logo from "@/assets/light_logo.png";
import light_logo2 from "@/assets/BOS_LEGS.png";
import { cn } from "@/utils/cn";

const links = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Users", icon: User, path: "/users" },
  { label: "Clients & Cases", icon: Folder, path: "/clients-cases" },
  { label: "Tasks", icon: ListTodo, path: "/tasks" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Archives", icon: Archive, path: "/archives" },
  { label: "Reports", icon: AreaChart, path: "/reports" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "User logs", icon: Clock, path: "/user-logs" },
];

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-50 flex h-full w-[240px] flex-col overflow-x-hidden rounded-none bg-[#1c3482] text-white shadow-md transition-all dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:left-full" : "max-md:left-0"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-x-3 p-4">
        <img
          src={light_logo2}
          alt="legalvault_logo_light"
          className="h-[60px] w-[60px] dark:hidden"
        />
        <img
          src={light_logo}
          alt="legalvault_logo_dark"
          className="hidden h-[60px] w-[60px] dark:block"
        />
        {!collapsed && (
          <p className="text-2xl font-semibold text-white font-serif">
            Legal Vault
          </p>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-y-2 px-2 pb-6">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-x-3 rounded-lg border border-white px-4 py-2 text-sm font-medium transition-all hover:bg-white hover:text-[#1c3482]",
                isActive ? "bg-white text-[#1c3482]" : "text-white",
                collapsed && "justify-center px-2"
              )
            }
          >
            <link.icon size={26} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>

           
        ))}
      </div>

      
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};




// import { forwardRef } from "react";
// import { NavLink } from "react-router-dom";
// import PropTypes from "prop-types";

// import { navbarLinks } from "../constants";
// import light_logo2 from "@/assets/light_logo2.png";
// import light_logo from "@/assets/light_logo.png";
// import { cn } from "@/utils/cn";

// export const Sidebar = forwardRef(({ collapsed }, ref) => {
//     return (
//         <aside
//             ref={ref}
//             className={cn(
//                 "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden rounded-lg border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
//                 collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
//                 collapsed ? "max-md:left-full" : "max-md:left-0",
//             )}
//         >
//             {/* Logo Section */}
//             <div className="flex items-center gap-x-3 p-3 opacity-60">
//                 <img
//                     src={light_logo2}
//                     alt="opascor_logo_light"
//                     className="h-23 w-20 dark:hidden"
//                 />
//                 <img
//                     src={light_logo}
//                     alt="opascor_logo_dark"
//                     className="h-23 hidden w-20 brightness-150 dark:block"
//                 />
//                 {!collapsed && <p className="font-serif text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">Legal Vault</p>}
//             </div>

//             {/* Navigation Links */}
//             <div className="flex w-full flex-col gap-y-3 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
//                 {navbarLinks.map((link) => (
//                     <NavLink
//                         key={link.label}
//                         to={link.path}
//                         className={cn("sidebar-item", collapsed && "md:w-[45px]")}
//                     >
//                         <link.icon
//                             size={22}
//                             className="flex-shrink-0"
//                         />
//                         {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
//                     </NavLink>
//                 ))}
//             </div>
//         </aside>
//     );
// });

// Sidebar.displayName = "Sidebar";

// Sidebar.propTypes = {
//     collapsed: PropTypes.bool,
// };
