import { useRef, useState, type ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  Building2,
  Camera,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { avatarProblem, initials, type AdminSession } from "@/lib/adminsession";
import { useConfirm, useToast } from "@/lib/feedback";
import { getDashboardStats } from "@/data/admindashboard";
import { useAdminResource } from "@/hooks/use-admin-data";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Inquiries", href: "/admin/inquiries", icon: Mail, badge: "newInquiries" as const },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  admin: AdminSession;
  onAvatarChange: (file: File | null) => Promise<void>;
  onLogout: () => void;
}

export default function AdminSidebar({ admin, onAvatarChange, onLogout }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { data: stats } = useAdminResource(getDashboardStats);
  const fileInput = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const toast = useToast();
  const confirm = useConfirm();

  async function uploadPhoto(file: File) {
    setPhotoBusy(true);
    try {
      await onAvatarChange(file);
      toast.success({ source: "Profile · Photo", title: "Profile photo updated", description: `${file.name} is now your profile photo.` });
    } catch (error) {
      toast.fromError(error, { source: "Profile · Photo", title: "Your photo wasn't uploaded" });
    } finally {
      setPhotoBusy(false);
    }
  }

  async function removePhoto() {
    setPhotoBusy(true);
    try {
      const confirmed = await confirm({
        tone: "danger",
        title: "Remove your profile photo?",
        description: "Your initials will be shown instead. You can add a new photo at any time.",
        subject: { label: admin.name, detail: admin.email },
        confirmLabel: "Remove photo",
        busyLabel: "Removing…",
        action: () => onAvatarChange(null),
      });
      if (confirmed) toast.success({ source: "Profile · Photo", title: "Profile photo removed", description: "Your initials are shown instead." });
    } catch (error) {
      toast.fromError(error, { source: "Profile · Photo", title: "Your photo wasn't removed" });
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = avatarProblem(file);
    if (problem) {
      toast.error({ source: "Profile · Photo", title: "That file can't be used", description: problem, reference: `${file.name} · ${Math.round(file.size / 1024)} KB` });
      return;
    }
    await uploadPhoto(file);
  }

  return (
    <Sidebar collapsible="icon">
      {/* Signed-in admin */}
      <SidebarHeader className="pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:px-0">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={photoBusy}
                aria-label={admin.avatarUrl ? "Change profile photo" : "Add profile photo"}
                title={admin.avatarUrl ? "Change profile photo" : "Add profile photo"}
                className="group/avatar relative size-11 shrink-0 rounded-full ring-2 ring-white transition focus-visible:outline-none focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:size-8"
              >
                {admin.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt=""
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-full items-center justify-center rounded-full bg-primary font-body text-sm font-semibold text-white"
                  >
                    {initials(admin.name)}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100"
                >
                  <Camera className="size-4" />
                </span>
              </button>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate font-headline text-lg font-semibold leading-tight text-primary">
                  {admin.name}
                </p>
                <p className="font-body text-xs text-sidebar-foreground/70">
                  {admin.role}
                </p>
                {admin.avatarUrl && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    disabled={photoBusy}
                    className="mt-0.5 rounded-sm font-body text-[11px] text-sidebar-foreground/60 underline-offset-2 hover:text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".jpg,.jpeg,.gif,.png,image/jpeg,image/gif,image/png"
              onChange={handlePhoto}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => {
                const isActive = pathname.startsWith(href);
                const count = badge && stats ? stats[badge] : 0;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      href={href}
                      isActive={isActive}
                      tooltip={label}
                      aria-current={isActive ? "page" : undefined}
                      className="h-10 font-body data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-primary-dark data-active:hover:text-white"
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {count > 0 && (
                      <SidebarMenuBadge className="rounded-full bg-tertiary text-white peer-data-active/menu-button:text-white">
                        {count}
                        <span className="sr-only"> new</span>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout */}
      <SidebarFooter className="border-t border-sidebar-border pb-4 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onPress={onLogout} tooltip="Logout" className="font-body">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
