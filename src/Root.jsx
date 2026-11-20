import { Suspense, lazy } from "react";
import App from "./App.jsx";

// /admin loads the reel admin panel; its code is only downloaded on that route.
const Admin = lazy(() => import("./admin/Admin.jsx"));
const isAdmin = () => /^\/admin(\/|$)/.test(window.location.pathname);

export default function Root() {
  return isAdmin() ? (
    <Suspense fallback={<div className="min-h-svh bg-black" />}>
      <Admin />
    </Suspense>
  ) : (
    <App />
  );
}
