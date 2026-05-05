import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(120deg,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_45%)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="editorial text-4xl">KK Rawat CMS</div>
          <CardTitle>Secure admin login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
