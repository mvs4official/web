"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

// actions/login.ts
export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);
    if (!validateFields.success) {
      return { error: "Invalid Fields" };
    }
    // ... rest of the login logic ...
    const {email,password} = validateFields.data;
    try {
      await signIn("credentials",{
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT
      })
    }catch(error){
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
          return { error: "Invalid Credentials !" }
          default:
            return { error: "Something went wrong" };
        }
    }
    throw error;
    }
  };

  