import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createAdminSession, getIsAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login | Godspeed",
};

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

async function login(formData: FormData) {
  "use server";

  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const isValid = email === adminEmail && password === adminPassword;

  if (!isValid) {
    redirect("/admin/login?error=invalid");
  }

  // ✅ await cookies() here
  const cookieStore = await cookies();
  cookieStore.set("godspeed_admin", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });


  await createAdminSession();

  redirect("/events");
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  // ✅ getIsAdmin is now async
  if (await getIsAdmin()) {
    redirect("/events");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
          <CardDescription>
            Sign in to manage events and other admin-only tools.
          </CardDescription>
        </CardHeader>

        <form action={login}>
          <CardContent className="space-y-4">
            {error === "invalid" && (
              <p className="text-sm text-destructive">
                Invalid email or password. Please try again.
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                defaultValue={
                  process.env.NODE_ENV === "development"
                    ? process.env.ADMIN_EMAIL
                    : ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="submit">Sign in</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}