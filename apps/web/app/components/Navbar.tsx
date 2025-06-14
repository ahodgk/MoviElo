import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Link, type LinkProps, useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clapperboard, MoonStar, Sun } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";
import { useTheme } from "~/components/context/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Switch } from "~/components/ui/switch";
import { logoutFn } from "~/lib/functions/auth/logout";

const NavButton = ({
  to,
  children,
  className,
}: {
  to: LinkProps["to"];
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Button variant={"link"} className="p-2" asChild>
      <Link className={`mx-2 dark:text-white ${className}`} to={to}>
        {children}
      </Link>
    </Button>
  );
};

export function Navbar() {
  // const { session, user, logout } = useSession();

  const { user } = useRouteContext({ from: "__root__" });

  const { theme, setTheme } = useTheme();

  const logout = useServerFn(logoutFn);

  const isLoggedIn = !!user; //!!session;

  const handleLogout: MouseEventHandler = async (e) => {
    e.preventDefault();
    await logout();
    window.location.href = "/login";
    // await navigate({ to: '/login' });
  };

  return (
    <nav
      key={isLoggedIn ? 1 : 0}
      className="box-border w-full shadow-xs border-b-2 p-4 flex flex-row justify-between items-center"
    >
      <div className="dark:text-white flex flex-row items-center">
        {/* <Button variant="ghost" className="mr-2 p-2">
          <Menu className="size-6" />
        </Button> */}
        <Clapperboard className="size-6 mr-2" />
        MoviElo
      </div>

      <div>
        <NavButton className="" to={"/lists"}>
          Lists
        </NavButton>
      </div>

      <div className="flex flex-row">
        {!isLoggedIn && (
          <NavButton className="" to="/register">
            Signup
          </NavButton>
        )}

        {!isLoggedIn && (
          <NavButton className="" to="/login">
            Login
          </NavButton>
        )}

        {isLoggedIn && (
          <DropdownMenu>
            {/* // onClick={handleMenu}
            className='p-2'

            // component={RouterLink}
            // href='/auth/profile'
            // variant='contained'
          > */}
            <DropdownMenuTrigger
              tabIndex={0}
              className="rounded-full text-white hover:text-accent "
            >
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              tabIndex={0}
              className="menu dropdown-content z-[100] rounded-box m-2 p-2 shadow"
            >
              <DropdownMenuItem>
                <Link activeOptions={{ exact: true }} to="/account">
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/settings">Settings</Link>
              </DropdownMenuItem>

              {/* <li>
                <Link to='/account/settings'>Settings</Link>
              </li> */}

              <DropdownMenuItem onClick={handleLogout}>
                {/* <form action={logout}> */}
                Logout
                {/* </form> */}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setTheme(theme === "light" ? "dark" : "light");
                }}
                className="flex flex-row items-center justify-between"
              >
                <Sun
                  data-theme={theme}
                  className="data-[theme=light]:text-amber-500 text-neutral-500"
                />

                <Switch checked={theme === "dark"} />
                <MoonStar
                  data-theme={theme}
                  className="data-[theme=dark]:text-blue-500"
                />
                {/* {theme} */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
    //     );
    //   }}
    // </LoggedInContext.Consumer>
  );
}
