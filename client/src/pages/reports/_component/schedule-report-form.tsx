import { Button } from "@/components/ui/button";
import { Loader, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useUpdateReportSettingMutation } from "@/features/report/reportAPI";
import { updateCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { useEffect } from "react";

const ReportFrequency = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

const formSchema = z.object({
  email: z.string(),
  frequency: z.nativeEnum(ReportFrequency),
  isEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleReportForm = ({
  onCloseDrawer,
}: {
  onCloseDrawer: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { user, reportSetting } = useTypedSelector((state) => state.auth);

  const [updateReportSetting, { isLoading }] = useUpdateReportSettingMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      isEnabled: reportSetting?.isEnabled || true,
      frequency: (reportSetting?.frequency as keyof typeof ReportFrequency) || ReportFrequency.MONTHLY,
    },
  });

  useEffect(() => {
    if (user && reportSetting) {
      form.reset({
        email: user?.email || "",
        isEnabled: reportSetting?.isEnabled,
        frequency: (reportSetting?.frequency as keyof typeof ReportFrequency) || ReportFrequency.MONTHLY,
      });
    }
  }, [user, form, reportSetting]);

  const onSubmit = (values: FormValues) => {
    const payload = { 
      isEnabled: values.isEnabled,
      frequency: values.frequency,
    };
    updateReportSetting(payload)
      .unwrap()
      .then(() => {
        dispatch(updateCredentials({ reportSetting: payload }));
        onCloseDrawer();
        toast.success("Pengaturan laporan berhasil diperbarui");
      })
      .catch((error) => {
        toast.error(error.data.message || "Gagal memperbarui pengaturan laporan");
      });
  };

  const getScheduleSummary = () => {
    const isEnabled = form.watch("isEnabled");
    const frequency = form.watch("frequency");

    if (!isEnabled) {
      return "Laporan saat ini dinonaktifkan.";
    }

    switch (frequency) {
      case ReportFrequency.WEEKLY:
        return "Laporan akan dikirim setiap hari Senin.";
      case ReportFrequency.MONTHLY:
        return "Laporan akan dikirim pada hari pertama setiap bulan.";
      case ReportFrequency.YEARLY:
        return "Laporan akan dikirim pada hari pertama setiap tahun.";
      default:
        return "Pilih frekuensi untuk melihat ringkasan jadwal.";
    }
  };

  return (
    <div className="pt-5 px-2.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full space-y-6 flex-1 px-4">
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Laporan Berkala</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Laporan aktif" : "Laporan nonaktif"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="relative space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          disabled={true}
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ulangi pada</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ReportFrequency.WEEKLY}>Mingguan</SelectItem>
                        <SelectItem value={ReportFrequency.MONTHLY}>Bulanan</SelectItem>
                        <SelectItem value={ReportFrequency.YEARLY}>Tahunan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.watch("isEnabled") && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10" />
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Ringkasan Jadwal</h3>
              <p className="text-sm text-muted-foreground">
                {getScheduleSummary()}
              </p>
            </div>

            <div className="sticky bottom-0 py-2 z-50">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white"
              >
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                Simpan perubahan
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleReportForm;