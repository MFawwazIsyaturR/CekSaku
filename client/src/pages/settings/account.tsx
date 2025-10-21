import { Separator } from "@/components/ui/separator"
import { AccountForm } from "./_components/account-form"

const Account = () => {
  return (
    <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Akun</h3>
      <p className="text-sm text-muted-foreground">
        Perbarui pengaturan akun Anda.
      </p>
    </div>
    <Separator />
    <AccountForm />
  </div>

  )
}

export default Account