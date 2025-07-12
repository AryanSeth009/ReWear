"use server"

import { redirect } from "next/navigation"
import { signUp, signIn, signOut } from "@/lib/auth"

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string

  if (password !== confirmPassword) {
    throw new Error("Passwords don't match")
  }

  try {
    await signUp(email, password, firstName, lastName)
    redirect("/dashboard")
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn(email, password)
    redirect("/dashboard")
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function signOutAction() {
  try {
    await signOut()
    redirect("/")
  } catch (error: any) {
    throw new Error(error.message)
  }
}
