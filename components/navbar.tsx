"use client";

import { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["Explore", "My Maps", "About"] as const;

export function Navbar({
  darkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
  isSignedIn,
  onSignOut,
}: {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSignedIn: boolean;
  onSignOut: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5" aria-label="CauseMap home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="text-primary-foreground"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="3" fill="currentColor" />
                <path
                  d="M9 2V5M9 13V16M2 9H5M13 9H16M4.2 4.2L6.3 6.3M11.7 11.7L13.8 13.8M13.8 4.2L11.7 6.3M6.3 11.7L4.2 13.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              CauseMap
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="mr-2 hidden text-muted-foreground hover:text-foreground md:inline-flex"
            >
              Sign Out
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-foreground hover:text-foreground"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab);
                  setMobileMenuOpen(false);
                }}
                className={`rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
            {isSignedIn && (
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
