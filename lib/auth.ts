import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";


const ADMIN_COOKIE_NAME = "godspeed_admin";
const ADMIN_ISSUER = "godspeed-app";

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET must be set in environment");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession() {
  const secretKey = getAuthSecret();

  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setIssuer(ADMIN_ISSUER)
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getIsAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const secretKey = getAuthSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: ADMIN_ISSUER,
    });

    return payload.admin === true;
  } catch {
    // invalid signature, expired token, etc.
    return false;
  }
}

export async function requireAdmin() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/admin/login");
  }
}