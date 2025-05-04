"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/app/login/providers";
import { LoadingProvider } from "@/app/context/LoadingContext";
import Loading from "@/components/ui/loading";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider  enableSystem disableTransitionOnChange>
      <AuthProvider>
        <LoadingProvider>
          {children}
          <Loading />
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
