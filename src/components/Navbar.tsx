import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Landmark } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import type { NavigationLink } from "../features/auth/types/types.ts";
import { useRbacAuthStore } from "../features/auth/store/RbacAuthStore.ts";
import { ModeToggle } from "./mode-toggle.tsx";

const navigationLinksBase: NavigationLink[] = [{ href: "/", label: "Home" }];

const navigationLinksProtected: NavigationLink[] = [
  ...navigationLinksBase,
  { href: "/dashboard", label: "Dashboard" },
  { href: "/test-page", label: "Test Page" },
];

export const Navigation = () => {
  const { user, isAuthenticated, logout } = useRbacAuthStore();
  const location = useLocation();

  const isErrorPages =
    location.pathname === "/not-found" || location.pathname === "/unauthorized";

  const navigationLinks = isAuthenticated
    ? navigationLinksProtected
    : navigationLinksBase;

  return (
    <header className="border-b px-4 md:px-6 sticky top-0 z-40 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        asChild
                        className="py-1.5"
                        active={location.pathname === link.href}
                      >
                        <Link to={link.href}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-primary hover:text-primary/90">
              <Landmark />
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      asChild
                      active={location.pathname === link.href}
                    >
                      <Link
                        to={link.href}
                        className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated && !isErrorPages ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{user?.firstName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <Button
                variant={"destructive"}
                onClick={logout}
                size="sm"
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              {!isErrorPages ? (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-sm">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="text-sm">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              ) : null}
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
