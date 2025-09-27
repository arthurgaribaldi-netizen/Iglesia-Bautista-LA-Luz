import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
  homeLabel?: string
  homeHref?: string
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 
    items, 
    className, 
    separator = <ChevronRight className="w-4 h-4" />,
    homeLabel = "Início",
    homeHref = "/",
  }, ref) => {
    const allItems = [
      { label: homeLabel, href: homeHref, icon: <Home className="w-4 h-4" /> },
      ...items,
    ];

    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1 text-sm", className)}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center">
                {!isFirst && (
                  <span className="mx-2 text-gray-400 dark:text-gray-600">
                    {separator}
                  </span>
                )}
                
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors",
                      "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      "focus:ring-church-primary", // Específico se church-primary estiver disponível
                    )}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1",
                      isLast 
                        ? "text-gray-900 font-medium dark:text-gray-100" 
                        : "text-gray-600 dark:text-gray-400",
                    )}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = "Breadcrumbs";

export { Breadcrumbs };
