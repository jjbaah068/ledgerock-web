import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useHref,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { RouterProvider as AriaRouterProvider } from "react-aria-components";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/adminsidebar";
import logo from "@/assets/logo.png";
import {
  getAdminSession,
  signOutAdmin,
  updateAdminSession,
  type AdminSession,
} from "@/lib/adminsession";

/**
 * Shell for every signed-in admin page: sidebar on the left, page content on
 * the right. Sends visitors without an admin session back to the login page.
 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [admin, setAdmin] = useState<AdminSession | null>(() => getAdminSession());

  useEffect(() => {
    const previous = document.title;
    document.title = "Admin | LedgeRock";
    return () => {
      document.title = previous;
    };
  }, []);

  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  function updateAdmin(changes: Partial<AdminSession>) {
    const updated = updateAdminSession(changes);
    setAdmin((current) => updated ?? (current ? { ...current, ...changes } : current));
  }

  function handleAvatarChange(avatarUrl: string | undefined) {
    updateAdmin({ avatarUrl });
  }

  function handleLogout() {
    signOutAdmin();
    navigate("/admin", { replace: true });
  }

  return (
    // Lets React Aria links (used by the shadcn sidebar) navigate client-side.
    <AriaRouterProvider navigate={navigate} useHref={useHref}>
      <SidebarProvider>
        <AdminSidebar
          admin={admin}
          onAvatarChange={handleAvatarChange}
          onLogout={handleLogout}
        />
        <SidebarInset className="bg-[#FAF7F1]">
          <div className="flex items-center gap-2 px-4 pt-4 md:hidden">
            <SidebarTrigger className="text-primary" />
            {/* The dashboard shows its own large logo, so skip this one there. */}
            {pathname !== "/admin/dashboard" && (
              <img
                src={logo}
                alt="LedgeRock at Cricket Creek"
                className="h-9 w-auto mix-blend-multiply"
              />
            )}
          </div>
          <Outlet context={{ admin, updateAdmin } satisfies AdminOutletContext} />
        </SidebarInset>
      </SidebarProvider>
    </AriaRouterProvider>
  );
}

interface AdminOutletContext {
  admin: AdminSession;
  /** Saves changes to the signed-in admin (name, email, photo) everywhere. */
  updateAdmin: (changes: Partial<AdminSession>) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin(): AdminSession {
  return useOutletContext<AdminOutletContext>().admin;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUpdateAdmin(): AdminOutletContext["updateAdmin"] {
  return useOutletContext<AdminOutletContext>().updateAdmin;
}
