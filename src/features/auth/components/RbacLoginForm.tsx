import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import { Label } from "../../../components/ui/label.tsx";
import { useEffect, useState } from "react";
import { Spinner } from "../../../components/ui/spinner.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { useRbacAuthStore } from "../store/RbacAuthStore.ts";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type formType = z.infer<typeof formSchema>;

const RbacLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { login, isAuthenticated, isLoading } = useRbacAuthStore();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleRoleSelect = (username: string, role: string) => {
    setSelectedRole(role);
    form.setValue("username", username);
    // Auto-fill password for demo
    const passwords: { [key: string]: string } = {
      john: "password123",
      jane: "bank123",
      teller: "teller123",
      manager: "manager123",
      admin: "admin123",
    };
    form.setValue("password", passwords[username] || "");
  };

  const handleSubmit = async (data: formType) => {
    await login(data.username, data.password);
  };

  const demoAccounts = [
    { username: "john", role: "Customer", password: "password123" },
    { username: "jane", role: "Customer", password: "bank123" },
    { username: "teller", role: "Bank Teller", password: "teller123" },
    { username: "manager", role: "Branch Manager", password: "manager123" },
    { username: "admin", role: "System Admin", password: "admin123" },
  ];

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg p-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Banking Portal
        </CardTitle>
        <CardDescription className="text-center">
          Select your role and enter credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label>Quick Role Selection</Label>
              <Select
                onValueChange={(value) =>
                  handleRoleSelect(value.split(":")[0], value.split(":")[1])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a demo role..." />
                </SelectTrigger>
                <SelectContent>
                  {demoAccounts.map((account) => (
                    <SelectItem
                      key={account.username}
                      value={`${account.username}:${account.role}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{account.role}</span>
                        <Badge variant="secondary">{account.username}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> Logging in as {selectedRole}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Type username" {...field} />
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
                    <Input
                      type="password"
                      placeholder="Type password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner /> Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RbacLoginForm;
