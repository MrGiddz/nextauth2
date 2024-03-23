import { Auth2User } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: Auth2User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: Auth2User;
    }
}