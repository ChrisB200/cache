import { GalleryVerticalEnd } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function CredentialsLayout({ children }: LayoutProps) {
  return (
    <div className="w-full bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 md:min-w-[475px]">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          CACHE
        </a>
        {children}
      </div>
    </div>
  );
}

export default CredentialsLayout;
