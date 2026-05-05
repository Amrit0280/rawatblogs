"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { loginAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state?.error ? <p className="text-sm font-semibold text-[var(--danger)]">{state.error}</p> : null}
      <Button type="submit" disabled={pending} variant="gold">
        <LockKeyhole size={16} />
        Sign in
      </Button>
    </form>
  );
}
