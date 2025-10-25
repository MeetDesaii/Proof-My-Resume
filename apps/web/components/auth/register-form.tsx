"use client";

import { useState } from "react";
import { Loader2, UserPlus, Shield } from "lucide-react";
import { Button } from "@visume/ui/components/button";
import { Input } from "@visume/ui/components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@visume/ui/components/form";
import { toast } from "sonner";
import { useSignUp } from "@clerk/nextjs";
import { cn } from "@visume/ui/lib/utils";

interface SignupFormProps {
  className?: string;
}

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: SignupFormProps & React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.create({
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.email,
        password: values.password,
      });

      const verificationEmail = await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      if (verificationEmail.status === "missing_requirements") {
        router.push("/verify");
      }

      toast.success("Verification code sent to your email");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  async function signUpWith(strategy: "oauth_google" | "oauth_linkedin") {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to sign up");
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 bg-white rounded-2xl p-6 shadow",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md">
              <Shield className="size-6" />
            </div>
            <span className="sr-only">Visume AI</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome to Visume AI</h1>
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          <Button
            variant="secondary"
            type="button"
            size="lg"
            className="w-full"
            onClick={() => signUpWith("oauth_google")}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 ">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus />}
              Sign up
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
