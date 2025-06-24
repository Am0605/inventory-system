import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    AlertTriangle,
    LayoutGrid,
    Package,
    Tags,
    ShoppingCart,
    TrendingUp,
    Users,
    Warehouse,
    ClipboardList,
    BarChart3,
    FileText,
    Truck,
    DollarSign,
    History,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        icon: Package,
        items: [
            {
                title: 'All Products',
                href: '/inventory/products',
                icon: Package,
            },
            {
                title: 'Categories',
                href: '/inventory/categories',
                icon: Tags,
            },
            {
                title: 'Low Stock',
                href: '/inventory/low-stock',
                icon: AlertTriangle,
            },
        ],
    },
    {
        title: 'Orders',
        icon: ShoppingCart,
        items: [
            {
                title: 'All Orders',
                href: '/orders',
                icon: ClipboardList,
            },
            {
                title: 'Create Order',
                href: '/orders/create',
                icon: ShoppingCart,
            },
            {
                title: 'Purchase Orders',
                href: '/orders/purchase',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Suppliers',
        href: '/suppliers',
        icon: Truck,
    },
    {
        title: 'Customers',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Warehouses',
        href: '/warehouses',
        icon: Warehouse,
    },
    {
        title: 'Reports',
        icon: BarChart3,
        items: [
            {
                title: 'Sales Report',
                href: '/reports/sales',
                icon: TrendingUp,
            },
            {
                title: 'Inventory Report',
                href: '/reports/inventory',
                icon: Package,
            },
            {
                title: 'Financial Report',
                href: '/reports/financial',
                icon: DollarSign,
            },
            {
                title: 'Stock Movement',
                href: '/reports/stock-movement',
                icon: History,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
