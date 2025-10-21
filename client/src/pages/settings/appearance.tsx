import { Separator } from "@/components/ui/separator"
import { AppearanceTheme } from "./_components/appearance-theme"

const Appearance = () => {
  return (
    <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Tampilan</h3>
      <p className="text-sm text-muted-foreground">
        Sesuaikan tampilan aplikasi. Beralih otomatis antara tema siang dan malam.
      </p>
    </div>
    <Separator />
    <AppearanceTheme />
  </div>
  )
}

export default Appearance