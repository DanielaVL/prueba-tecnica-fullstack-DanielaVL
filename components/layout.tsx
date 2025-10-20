import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Footer } from "./ui/footer";

interface LayoutProps {
  children: ReactNode;
  withSidebar?: boolean;
  withFooter?: boolean;
  footerFixed?: boolean;
}

export function Layout({ 
  children, 
  withSidebar = true, 
  withFooter = true,
  footerFixed = false 
}: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {withSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col ${withSidebar ? "" : "w-full"}`}>
        {children}
        {withFooter && <Footer fixed={footerFixed} />}
      </div>
    </div>
  );
}
