import { useEffect, useState } from "react";
import {
  Link,
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
import { ExternalLink } from "lucide-react";
import logo from "@/assets/logo.webp";
import {
  fetchAdminSession,
  removeAdminAvatar,
  signOutAdmin,
  uploadAdminAvatar,
  type AdminSession,
} from "@/lib/adminsession";
import { setSignedOutHandler } from "@/lib/api";
import { useToast } from "@/lib/feedback";
import { refreshAdminData } from "@/data/admindashboard";
import { AdminError, AdminLoading } from "@/components/adminstatus";

type Phase = "loading" | "ready" | "signedOut" | "unavailable";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [attempt, setAttempt] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const previous = document.title;
    document.title = "Admin | LedgeRock";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchAdminSession()
      .then((session) => {
        if (!active) return;
        setAdmin(session);
        setPhase(session ? "ready" : "signedOut");
      })
      .catch(() => {
        if (active) setPhase("unavailable");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(
    () =>
      setSignedOutHandler(() => {
        setPhase((current) => {
          if (current === "ready") {
            toast.warning({
              source: "Account · Session",
              title: "Your session has ended",
              description: "For your security you were signed out. Sign in again to continue.",
            });
          }
          return "signedOut";
        });
        setAdmin(null);
      }),
    [toast],
  );

  useEffect(() => {
    window.addEventListener("focus", refreshAdminData);
    return () => window.removeEventListener("focus", refreshAdminData);
  }, []);

  if (phase === "signedOut") {
    return <Navigate to="/lr-manage" replace />;
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F1]">
        <AdminLoading label="Loading your account..." />
      </div>
    );
  }

  if (phase === "unavailable" || !admin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF7F1] px-6">
        <AdminError message="We couldn't reach the server." />
        <button
          type="button"
          onClick={() => {
            setPhase("loading");
            setAttempt((value) => value + 1);
          }}
          className="rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Try again
        </button>
      </div>
    );
  }

  async function handleAvatarChange(file: File | null) {
    setAdmin(file ? await uploadAdminAvatar(file) : await removeAdminAvatar());
  }

  async function handleLogout() {
    try {
      await signOutAdmin();
      setAdmin(null);
      setPhase("signedOut");
      toast.info({ source: "Account · Sign out", title: "You've been signed out", description: "Sign in again whenever you need to manage LedgeRock.", duration: 4000 });
    } catch (error) {
      toast.fromError(error, { source: "Account · Sign out", title: "You're still signed in" });
    }
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
          {/* Admin top bar: collapse toggle + current section. Replaces the public site nav. */}
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-neutral-700/10 bg-[#FAF7F1]/95 px-4 backdrop-blur">
            <SidebarTrigger className="text-primary hover:bg-sidebar-accent" />
            <span aria-hidden="true" className="h-5 w-px bg-neutral-700/15" />
            {/* The dashboard shows its own large logo, so only show the small one elsewhere on phones. */}
            {pathname !== "/admin/dashboard" && (
              <img
                src={logo}
                alt="LedgeRock at Cricket Creek"
                className="h-8 w-auto mix-blend-multiply md:hidden"
              />
            )}
            <p className="hidden font-headline text-base font-semibold text-neutral-700 md:block">
              {pageTitle(pathname)}
            </p>
            <Link
              to="/"
              className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 font-body text-sm text-neutral-700/80 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">View site</span>
              <span className="sr-only sm:hidden">View site</span>
            </Link>
          </header>
          <Outlet context={{ admin, updateAdmin: setAdmin } satisfies AdminOutletContext} />
        </SidebarInset>
      </SidebarProvider>
    </AriaRouterProvider>
  );
}

/** Heading shown in the admin top bar for the current route. */
function pageTitle(pathname: string): string {
  if (pathname === "/admin/properties/new") return "Add Property";
  if (pathname.startsWith("/admin/properties/") && pathname.endsWith("/edit")) return "Edit Property";
  if (pathname.startsWith("/admin/properties")) return "Properties";
  if (pathname.startsWith("/admin/inquiries")) return "Inquiries";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Dashboard";
}

interface AdminOutletContext {
  admin: AdminSession;
  updateAdmin: (admin: AdminSession) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin(): AdminSession {
  return useOutletContext<AdminOutletContext>().admin;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUpdateAdmin(): AdminOutletContext["updateAdmin"] {
  return useOutletContext<AdminOutletContext>().updateAdmin;
}
