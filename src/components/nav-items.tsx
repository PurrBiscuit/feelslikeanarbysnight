"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MenuLink = () => (
  <a
    href="https://www.arbys.com/menu"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors text-sm font-medium"
  >
    <img src="/arbys-marker.png" alt="" width={18} height={16} />
    Menu
  </a>
);

const GitHubLink = () => (
  <a
    href="https://github.com/PurrBiscuit/feelslikeanarbysnight"
    target="_blank"
    rel="noopener noreferrer"
    className="text-text-secondary hover:text-text-primary transition-colors"
    aria-label="GitHub repository"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  </a>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function ThemeTabs() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tabs
      className='w-full'
      defaultValue={resolvedTheme ?? "dark"}
      onValueChange={(val) => setTheme(val as string)}
    >
      <TabsList className="w-full">
        <TabsTrigger value="light" className="flex-1"><Sun className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="dark" className="flex-1"><Moon className="h-4 w-4" /></TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function NavItems() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <MenuLink />
        <GitHubLink />
        <ThemeToggle />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer outline-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface border-border w-30">
            <div className="flex flex-col items-center gap-2 p-2">
              <DropdownMenuItem className="focus:bg-surface-elevated cursor-pointer w-full justify-center" onSelect={(e) => e.preventDefault()}>
                <a
                  href="https://www.arbys.com/menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-primary text-sm w-full"
                >
                  <img src="/arbys-marker.png" alt="" width={16} height={14} />
                  Menu
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-surface-elevated cursor-pointer w-full justify-center" onSelect={(e) => e.preventDefault()}>
                <a
                  href="https://github.com/PurrBiscuit/feelslikeanarbysnight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-primary text-sm w-full"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border w-full" />
              <ThemeTabs />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
