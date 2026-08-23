import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function isAdminAuthenticated(req?: NextRequest): Promise<boolean> {
  // Check headers first (for API/test scripts)
  if (req) {
    const headerUser = req.headers.get("x-admin-username");
    const headerPass = req.headers.get("x-admin-password");
    if (
      headerUser &&
      headerPass &&
      headerUser === (process.env.ADMIN_USERNAME || "admin") &&
      headerPass === (process.env.ADMIN_PASSWORD || "admin123")
    ) {
      return true;
    }
  }

  // Check HTTP-only cookie for pages and browser requests
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "true";
}
