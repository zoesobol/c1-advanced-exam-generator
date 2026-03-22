import { Outlet } from "react-router-dom";

import { PageContainer } from "./PageContainer";
import { TopNav } from "./TopNav";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
