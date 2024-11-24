import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentuser } from "./services/Auth";


type TRole = keyof typeof roleBasedRoutesAccess;
const authRoutes = ["/login","/find-account","/confirm-identity"];
const roleBasedRoutesAccess:any = {
  Faculty: [/^(?!\/admin).*/],
  Admin: [/^\/.*/],
};
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  const user = await getCurrentuser();

  if (!user || Object.keys(user).length === 0) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }
  if (user?.role && roleBasedRoutesAccess[user?.role ]) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const allowedRoutes = roleBasedRoutesAccess[user?.role];

    // Check if the route is allowed for the user role
    const hasAccess = allowedRoutes.some((route:string) => pathname.match(route));

    if (hasAccess) {
      return NextResponse.next();
    }
  }

  //Default fallback redirect in case no role matches
  return NextResponse.redirect(new URL("/", request.url));


}

export const config = {
  matcher: [
    "/((?!api|public|_next/static|_next/image|ju-logo.png).*)",
 
  ],
};
