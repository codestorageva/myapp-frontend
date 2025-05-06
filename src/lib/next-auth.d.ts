import { PermissionList } from "@/feature_start/domain/useCase/login";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
        success: boolean;
        successCode: string;
        email: string;
        authToken: string;
        roleId: number;
        roleName: string;
        fullName: string;
        userName: string;
        mobNo: string;
    } & DefaultSession["user"];
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    authToken: string;
    email: string;
    roleName: string;
    fullName: string;
  }
}
