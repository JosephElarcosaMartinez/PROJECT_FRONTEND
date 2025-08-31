import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "@/context/auth-context";

import { getNavbarLinks } from "../constants";
import light_logo from "@/assets/b_legalvault.png";
import light_logo2 from "@/assets/w_legalvault.png";
import { cn } from "@/utils/cn";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { user } = useAuth();
    const navbarLinks = getNavbarLinks(user?.user_role);

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-100 flex h-full w-[240px] flex-col overflow-x-hidden rounded-lg bg-[#1c3482] p-3 text-white shadow-md transition-all dark:bg-slate-900",
                collapsed ? "p-0 md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:left-full" : "max-md:left-0",
            )}
        >
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-x-3 p-1 border-b border-white/20 pb-3 pt-3">
                <img
                    src={light_logo2}
                    alt="legalvault_logo_light"
                    className="h-12 w-25 dark:hidden "
                />
                <img
                    src={light_logo2}
                    alt="legalvault_logo_dark"
                    className="h-12 w-25 hidden dark:block"
                />

                {!collapsed && (
                    <p className="font-serif text-2xl font-bold tracking-wide text-white drop-shadow-lg">
                        Legal Vault
                    </p>
                )}


            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-y-3 px-2 pb-6 mt-6">
                {navbarLinks.map((link) => (
                    <NavLink
                        key={link.label}
                        to={link.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-x-3 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition-all duration-300",
                                "shadow-lg",
                                "bg-white/10 dark:bg-white/5",
                                "hover:translate-x-1 hover:scale-[1.02] hover:shadow-lg hover:bg-white/50 hover:text-[#1c3482] dark:hover:bg-white/50 dark:hover:text-white",
                                isActive ? "bg-white/100 text-[#1c3482] dark:bg-white/100" : "text-white",
                                collapsed && "justify-center px-2",
                            )
                        }
                    >
                        <link.icon size={26} className={cn(link.color, "transition-transform duration-300")} />

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
