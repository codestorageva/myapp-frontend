"use server";
import { signOut } from "next-auth/react";
export default async function logOut()  {
  try {
    const res = await signOut();
    console.log("res signout",res)
    return res;
  } catch (e) {
    throw e;
  }
}
