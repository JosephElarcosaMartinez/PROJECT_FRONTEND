import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { navbarLinks } from "../constants";
import light_logo from "@/assets/light_logo.png";
import light_logo2 from "@/assets/BOS_LEGS.png";
import { cn } from "@/utils/cn";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[50] flex h-full w-[240px] flex-col overflow-x-hidden rounded-lg bg-[#1c3482] p-2 text-white shadow-md transition-all dark:bg-slate-900",
                collapsed ? "p-0 md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:left-full" : "max-md:left-0",
            )}
        >
            {/* Logo Section */}
            <div className="flex items-center gap-x-3 p-4">
                <img
                    src={light_logo2}
                    alt="legalvault_logo_light"
                    className="h-23 w-20 dark:hidden"
                />
                <img
                    src={light_logo}
                    alt="legalvault_logo_dark"
                    className="h-23 hidden w-20 brightness-150 dark:block"
                />
                {!collapsed && <p className="font-serif text-2xl font-semibold text-white">Legal Vault</p>}
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-y-3 px-2 pb-6">
                {navbarLinks.map((link) => (
                    <NavLink
                        key={link.label}
                        to={link.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-x-3 rounded-lg border border-white px-4 py-2 text-sm font-medium transition-all hover:bg-slate-200 hover:text-blue-950 dark:hover:bg-slate-500 dark:hover:text-white",
                                isActive ? "bg-white text-[#1c3482]" : "text-white",
                                collapsed && "justify-center px-2",
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
