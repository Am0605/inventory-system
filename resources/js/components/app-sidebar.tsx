// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Package, 
    ShoppingCart, 
    TrendingUp, 
    Users, 
    Warehouse, 
    ClipboardList, 
    BarChart3, 
    AlertTriangle,
    PackageSearch,
    FileText,
    Truck,
    DollarSign,
    History,
    Tags,
    // BookOpen, 
    // Folder
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
                title: 'Add Product',
                href: '/inventory/products/create',
                icon: PackageSearch,
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

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

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
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
