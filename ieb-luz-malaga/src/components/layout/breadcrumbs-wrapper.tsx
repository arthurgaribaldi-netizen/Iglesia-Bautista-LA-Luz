"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

interface BreadcrumbsWrapperProps {
  customItems?: Array<{ label: string; href?: string }>
  className?: string
}

export function BreadcrumbsWrapper({ customItems, className }: BreadcrumbsWrapperProps) {
  const pathname = usePathname();
  const autoBreadcrumbs = useBreadcrumbs();
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null;
  }
  
  // Use custom items if provided, otherwise use auto-generated ones
  const breadcrumbItems = customItems || autoBreadcrumbs;
  
  return (
    <div className={`container mx-auto px-4 py-4 ${className || ''}`}>
      <Breadcrumbs items={breadcrumbItems} />
    </div>
  );
}
