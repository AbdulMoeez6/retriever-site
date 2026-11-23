// Minimal routing helpers for the workspace islands. Every route is a real static Astro page,
// so links are plain anchors and navigation is a normal page load. Workspace state survives
// navigation through the session store (see store.js).
import { useCallback } from "react";
import { pathWithoutBase, withBase } from "@/lib/utils/url";

const currentPath = () =>
  typeof window === "undefined" ? "/" : pathWithoutBase(window.location.pathname);

export function useNavigate() {
  return useCallback((to) => {
    window.location.assign(withBase(to));
  }, []);
}

export function useLocation() {
  return { pathname: currentPath() };
}

export function Link({ to, children, ...rest }) {
  return (
    <a href={withBase(to)} {...rest}>
      {children}
    </a>
  );
}

export function NavLink({ to, className, children, ...rest }) {
  const isActive = currentPath() === to;
  const cls = typeof className === "function" ? className({ isActive }) : className;
  return (
    <a href={withBase(to)} className={cls} aria-current={isActive ? "page" : undefined} {...rest}>
      {children}
    </a>
  );
}
