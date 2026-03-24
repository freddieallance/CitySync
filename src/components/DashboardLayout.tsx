import { ReactNode } from "react";
import { Activity, CloudRain, Heart, Navigation, LayoutDashboard, MapPin } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
} from "./ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    id: "overview",
  },
  {
    title: "Traffic Congestion",
    icon: Navigation,
    id: "traffic",
  },
  {
    title: "Flooding Risks",
    icon: CloudRain,
    id: "flooding",
  },
  {
    title: "Air Quality",
    icon: Activity,
    id: "air-quality",
  },
  {
    title: "Healthcare Access",
    icon: Heart,
    id: "healthcare",
  },
];

export function DashboardLayout({ children, activeView, onViewChange }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-sidebar-foreground">Smart Healthy Sarawak</h2>
              <p className="text-sm text-muted-foreground">Urban Intelligence Platform</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.id)}
                      isActive={activeView === item.id}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="h-screen overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
