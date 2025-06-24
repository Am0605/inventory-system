import { 
    SidebarGroup, 
    SidebarGroupLabel, 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    SidebarMenuSub, 
    SidebarMenuSubButton, 
    SidebarMenuSubItem 
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavMainProps {
    items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
    const { url } = usePage();
    
    const isActiveItem = (href: string) => {
        return url === href || url.startsWith(href + '/');
    };
    
    const hasActiveChild = (item: NavItem) => {
        if (!item.items) return false;
        return item.items.some(child => isActiveItem(child.href));
    };

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 mb-2">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const itemIsActive = item.href ? isActiveItem(item.href) : false;
                    const hasActiveChildItem = hasActiveChild(item);
                    const shouldBeOpen = itemIsActive || hasActiveChildItem;
                    
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={shouldBeOpen}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton 
                                        tooltip={item.title}
                                        className={cn(
                                            "w-full h-9 px-2 rounded-md transition-all duration-200 ease-in-out",
                                            "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                            "group/button",
                                            (itemIsActive || hasActiveChildItem) && [
                                                "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
                                                "border-l-2 border-sidebar-accent-foreground/30",
                                                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                            ]
                                        )}
                                        asChild={!!item.href}
                                    >
                                        {item.href ? (
                                            <Link 
                                                href={item.href} 
                                                prefetch 
                                                className="flex items-center gap-3 w-full h-full"
                                            >
                                                <div className={cn(
                                                    "flex items-center justify-center w-5 h-5 rounded-sm transition-colors duration-200",
                                                    (itemIsActive || hasActiveChildItem) 
                                                        ? "text-sidebar-accent-foreground" 
                                                        : "text-sidebar-foreground/70 group-hover/button:text-sidebar-accent-foreground"
                                                )}>
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                </div>
                                                <span className={cn(
                                                    "font-medium text-sm transition-colors duration-200 truncate",
                                                    (itemIsActive || hasActiveChildItem) 
                                                        ? "text-sidebar-accent-foreground" 
                                                        : "text-sidebar-foreground group-hover/button:text-sidebar-accent-foreground"
                                                )}>
                                                    {item.title}
                                                </span>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-3 w-full h-full">
                                                <div className={cn(
                                                    "flex items-center justify-center w-5 h-5 rounded-sm transition-colors duration-200",
                                                    (itemIsActive || hasActiveChildItem) 
                                                        ? "text-sidebar-accent-foreground" 
                                                        : "text-sidebar-foreground/70 group-hover/button:text-sidebar-accent-foreground"
                                                )}>
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                </div>
                                                <span className={cn(
                                                    "flex-1 font-medium text-sm transition-colors duration-200 truncate",
                                                    (itemIsActive || hasActiveChildItem) 
                                                        ? "text-sidebar-accent-foreground" 
                                                        : "text-sidebar-foreground group-hover/button:text-sidebar-accent-foreground"
                                                )}>
                                                    {item.title}
                                                </span>
                                                {item.items && (
                                                    <ChevronRight className={cn(
                                                        "h-4 w-4 transition-all duration-300 ease-in-out",
                                                        "group-data-[state=open]/collapsible:rotate-90",
                                                        "group-hover/button:scale-110",
                                                        (itemIsActive || hasActiveChildItem) 
                                                            ? "text-sidebar-accent-foreground" 
                                                            : "text-sidebar-foreground/50 group-hover/button:text-sidebar-accent-foreground"
                                                    )} />
                                                )}
                                            </div>
                                        )}
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                {item.items?.length && (
                                    <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                                        <SidebarMenuSub className="ml-4 mt-2 mb-1 space-y-1 border-l-2 border-sidebar-border/30 pl-4 -mr-2">
                                            {item.items.map((subItem, index) => {
                                                const subItemIsActive = isActiveItem(subItem.href);
                                                
                                                return (
                                                    <SidebarMenuSubItem 
                                                        key={subItem.title}
                                                        className={cn(
                                                            "animate-fade-in",
                                                            `animation-delay-${index * 30}`
                                                        )}
                                                    >
                                                        <SidebarMenuSubButton 
                                                            asChild
                                                            className={cn(
                                                                "h-9 py-2 px-2 rounded-lg transition-all duration-200 ease-in-out relative group/sub",
                                                                "hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground",
                                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                                "before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2",
                                                                "before:w-3 before:h-px before:bg-sidebar-border/40 before:transition-all before:duration-200",
                                                                "hover:before:bg-sidebar-accent-foreground/60 hover:before:w-6",
                                                                subItemIsActive && [
                                                                    "bg-sidebar-accent/50 text-sidebar-accent-foreground shadow-sm",
                                                                    "before:bg-sidebar-accent-foreground before:w-4 before:h-0.5",
                                                                    "font-medium border border-sidebar-accent/30"
                                                                ]
                                                            )}  
                                                        >
                                                            <Link 
                                                                href={subItem.href} 
                                                                prefetch
                                                                className="flex items-center gap-3 w-full h-full"
                                                            >
                                                                {subItem.icon && (
                                                                    <div className={cn(
                                                                        "flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200",
                                                                        "bg-sidebar-accent/10 border border-sidebar-border/20",
                                                                        subItemIsActive 
                                                                            ? "text-sidebar-accent-foreground bg-sidebar-accent/30 border-sidebar-accent/50 scale-105 shadow-sm" 
                                                                            : "text-sidebar-foreground/60 group-hover/sub:text-sidebar-accent-foreground group-hover/sub:bg-sidebar-accent/20 group-hover/sub:border-sidebar-accent/30 group-hover/sub:scale-105"
                                                                    )}>
                                                                        <subItem.icon className="h-3.5 w-3.5" />
                                                                    </div>
                                                                )}
                                                                <span className={cn(
                                                                    "text-sm transition-all duration-200 truncate flex-1",
                                                                    subItemIsActive 
                                                                        ? "text-sidebar-accent-foreground font-medium" 
                                                                        : "text-sidebar-foreground/80 group-hover/sub:text-sidebar-accent-foreground"
                                                                )}>
                                                                    {subItem.title}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
