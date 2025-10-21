import { Separator } from "@/components/ui/separator";
import { SecurityForm } from "./_components/security-form";

const Security = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Keamanan</h3>
        <p className="text-sm text-muted-foreground">
          Ubah kata sandi Anda di sini.
        </p>
      </div>
      <Separator />
      <SecurityForm />
    </div>
  );
};

export default Security;