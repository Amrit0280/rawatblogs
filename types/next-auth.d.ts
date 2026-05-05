import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: "ADMIN" | "EDITOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "EDITOR";
  }
}
