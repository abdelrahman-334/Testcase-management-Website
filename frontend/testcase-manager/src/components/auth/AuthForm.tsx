import React, { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useRouter } from "next/router";


type FormType = "login" | "sign-up";

interface LoginFormProps {
  className?: string;
  type: FormType; // 'login' or 'sign-up'
}

export default function LoginForm({
  
  className,
  type,
  ...props
}: LoginFormProps) {
  // State for form fields
  const router = useRouter();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Tester" | "QALead" | "">("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value as "Tester" | "QALead");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  const url = type === "login" ? "/login" : "/register"; // Choose API endpoint based on type
  const payload = type === "login"
    ? { email, password } // Login requires only email and password
    : { username, email, password, role }; // Sign-up requires additional fields

  try {
    const response = await fetch(`http://localhost:4000${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // Send form data as JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      alert(`Error: ${errorData.message}`);
      return;
    }

    const data = await response.json();
    console.log("Success:", data);

    // Redirect or update UI based on successful response
    if (type === "login") {
      router.push("/")
    } else {
      router.push("/sign-in")
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{type === "login" ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {type === "login" 
              ? "Enter your email below to login to your account"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
            { type == "sign-up" && <div className="grid gap-2" >
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username} // Bind to state
                  onChange={handleNameChange} // Update state on change
                  required
                />
              </div>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email} // Bind to state
                  onChange={handleEmailChange} // Update state on change
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {type === "login" && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password} // Bind to state
                  onChange={handlePasswordChange} // Update state on change
                  required
                />
              </div>

              {type === "sign-up" && (
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        id="Tester"
                        type="radio"
                        name="role"
                        value="Tester"
                        checked={role === "Tester"}
                        onChange={handleRoleChange} // Update role on change
                        className="mr-2"
                        required
                      />
                      <Label htmlFor="developer">Developer</Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="qa-lead"
                        type="radio"
                        name="role"
                        value="qa-lead"
                        checked={role === "QALead"}
                        onChange={handleRoleChange} // Update role on change
                        className="mr-2"
                        required
                      />
                      <Label htmlFor="qa-lead">QA Lead</Label>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                {type === "login" ? "Login" : "Sign Up"}
              </Button>
              {type === "login" && (
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              {type === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href={"/sign-up"} className="underline underline-offset-4">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href={"/sign-in"} className="underline underline-offset-4">
                    Sign in
                  </Link> 
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



{/* <Link href={"/sign-in"} className="underline underline-offset-4">
Sign in
</Link> */}