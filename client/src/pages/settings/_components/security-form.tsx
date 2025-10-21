import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChangePasswordMutation } from "@/features/user/userAPI";


const securityFormSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Kata sandi lama harus diisi." }),
    newPassword: z
      .string()
      .min(6, { message: "Kata sandi baru minimal 6 karakter." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Konfirmasi kata sandi minimal 6 karakter." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi baru dan konfirmasi tidak cocok.",
    path: ["confirmPassword"],
  });

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function SecurityForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SecurityFormValues) => {
    if (isLoading) return;

    changePassword(values)
      .unwrap()
      .then(() => {
        toast.success("Kata sandi berhasil diubah.");
        form.reset();
      })
      .catch((error) => {
        toast.error(error.data?.message || "Gagal mengubah kata sandi.");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kata Sandi Lama</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kata Sandi Baru</FormLabel>
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
              <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          Ubah Kata Sandi
        </Button>
      </form>
    </Form>
  );
}