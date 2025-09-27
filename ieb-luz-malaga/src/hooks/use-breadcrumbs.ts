"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

// Route configuration for automatic breadcrumb generation
const routeConfig: Record<string, { label: string; href?: string }> = {
  // Páginas públicas
  "/": { label: "Início" },
  "/sobre": { label: "Sobre Nós" },
  "/eventos": { label: "Eventos" },
  "/sermoes": { label: "Sermões" },
  "/recursos": { label: "Recursos" },
  "/enlaces": { label: "Enlaces" },
  "/contato": { label: "Contato" },
  "/transmissoes": { label: "Transmissões" },
  "/test-breadcrumbs": { label: "Test Breadcrumbs" },
  
  // Páginas administrativas
  "/admin": { label: "Admin" },
  "/admin/eventos": { label: "Eventos", href: "/admin/eventos" },
  "/admin/sermoes": { label: "Sermões", href: "/admin/sermoes" },
  "/admin/recursos": { label: "Recursos", href: "/admin/recursos" },
  "/admin/contatos": { label: "Contatos", href: "/admin/contatos" },
  "/admin/links": { label: "Links", href: "/admin/links" },
  "/admin/usuarios": { label: "Usuários", href: "/admin/usuarios" },
  "/admin/configuracoes": { label: "Configurações", href: "/admin/configuracoes" },
  "/admin/youtube-analytics": { label: "YouTube Analytics", href: "/admin/youtube-analytics" },
  
  // Páginas de login
  "/admin/login": { label: "Login", href: "/admin/login" },
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  
  return useMemo(() => {
    // Split pathname into segments
    const segments = pathname.split('/').filter(Boolean);
    
    // Build breadcrumb items
    const items: BreadcrumbItem[] = [];
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Check if we have a configuration for this path
      const config = routeConfig[currentPath];
      
      if (config) {
        items.push({
          label: config.label,
          href: config.href || currentPath,
        });
      } else {
        // Fallback: capitalize and clean the segment
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        items.push({
          label,
          href: currentPath,
        });
      }
    });
    
    return items;
  }, [pathname]);
}

// Custom hook for pages that want to override or extend breadcrumbs
export function useCustomBreadcrumbs(customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  const autoItems = useBreadcrumbs();
  
  return useMemo(() => {
    if (customItems) {
      return customItems;
    }
    
    return autoItems;
  }, [customItems, autoItems]);
}
