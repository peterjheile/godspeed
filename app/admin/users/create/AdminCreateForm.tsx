"use client"

import { useFormState, useFormStatus } from "react-dom"
import { createAdminAction, type CreateAdminState } from "./action"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create admin"}
    </Button>
  )
}

export function AdminCreateForm() {
  const initialState: CreateAdminState = { error: undefined }
  const [state, formAction] = useFormState(createAdminAction, initialState)

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/users"
          className="text-sm text-slate-400 hover:text-slate-100"
        >
          ← Back to admin users
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Admin</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error UI */}
          {state.error && (
            <div className="mb-4 rounded-md border border-red-500/70 bg-red-950/70 px-3 py-2 text-sm text-red-100">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" name="name" placeholder="Admin name" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Strong password"
              />
              <p className="text-xs text-slate-400">
                Must be at least 10 characters and include a letter, a number,
                and a symbol.
              </p>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}