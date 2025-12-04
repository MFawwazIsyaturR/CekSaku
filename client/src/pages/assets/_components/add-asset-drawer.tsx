import { useState } from "react";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CurrencyInputField from "@/components/ui/currency-input";
import { AssetCategory } from "@/features/asset/assetType";
import { useCreateAssetMutation } from "@/features/asset/assetAPI";
import { toast } from "sonner";

export default function AddAssetDrawer() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<AssetCategory>("cash");
  const [institution, setInstitution] = useState("");

  // Menggunakan hook mutasi dari RTK Query
  const [createAsset, { isLoading }] = useCreateAssetMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !amount) {
        toast.error("Mohon lengkapi nama dan nilai aset");
        return;
    }

    try {
      // Panggil API
      await createAsset({
        name,
        amount: parseFloat(amount), // Pastikan dikonversi ke number
        category,
        institution: institution || undefined,
      }).unwrap();

      toast.success("Aset berhasil ditambahkan");
      
      // Reset form & tutup drawer
      setName("");
      setAmount("");
      setCategory("cash");
      setInstitution("");
      setOpen(false);
      
    } catch (error: any) {
      toast.error(error.data?.message || "Gagal menambahkan aset");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Tambah Aset
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Tambah Aset Baru</DrawerTitle>
            <DrawerDescription>Catat aset atau investasi baru Anda.</DrawerDescription>
          </DrawerHeader>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Aset</Label>
              <Input 
                id="name" 
                placeholder="Misal: Deposito BCA, Emas Antam" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">Nilai Aset (Rp)</Label>
                <CurrencyInputField
                    name="amount"
                    placeholder="0"
                    value={amount}
                    onValueChange={(val) => setAmount(val || "")}
                    disabled={isLoading}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select 
                        value={category} 
                        onValueChange={(val: AssetCategory) => setCategory(val)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Kas & Bank</SelectItem>
                            <SelectItem value="investment">Investasi</SelectItem>
                            <SelectItem value="property">Properti/Barang</SelectItem>
                            <SelectItem value="crypto">Kripto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="institution">Institusi/Platform</Label>
                    <Input 
                        id="institution" 
                        placeholder="Misal: Bibit, Binance" 
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <DrawerFooter className="px-0 mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Aset
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" disabled={isLoading}>Batal</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}