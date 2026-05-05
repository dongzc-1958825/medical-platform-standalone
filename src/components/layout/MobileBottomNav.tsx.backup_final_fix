import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/mobile/cases", icon: "📋", label: "医案" },
  { path: "/mobile/community", icon: "👥", label: "社区" },
  { path: "/mobile/consult", icon: "💬", label: "问药" },
  { path: "/mobile/messages", icon: "✉️", label: "消息" },
  { path: "/mobile/profile", icon: "👤", label: "我的" }
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
            end={item.path === "/mobile/cases"}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}