import { useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format-currency";
import { useGetBudgetsQuery, useDeleteBudgetMutation } from "@/features/budget/budgetAPI";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyInputField from "@/components/ui/currency-input";
import { EXPENSE_CATEGORIES } from "@/constant"; // Pastikan import list kategori Anda
import { useSetBudgetMutation } from "@/features/budget/budgetAPI";
import { toast } from "sonner";

export default function BudgetWidget() {
  const { data, isLoading } = useGetBudgetsQuery();
  const budgets = data?.data || [];
  
  // Jika loading atau tidak ada data, kita tampilkan empty state kecil atau skeleton
  // Tapi agar rapi di dashboard, kita tampilkan card kosong dengan tombol "Tambah"
  
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Status Anggaran</CardTitle>
        <ManageBudgetDialog />
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
           <p className="text-sm text-muted-foreground">Memuat data anggaran...</p>
        ) : budgets.length === 0 ? (
           <div className="text-center py-4 space-y-2">
             <p className="text-sm text-muted-foreground">Belum ada target anggaran.</p>
             <ManageBudgetDialog triggerText="Buat Target Baru" />
           </div>
        ) : (
          budgets.map((budget) => (
            <BudgetItem key={budget._id} budget={budget} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function BudgetItem({ budget }: { budget: any }) {
  const isOver = budget.percentage >= 100;
  const isWarning = budget.percentage >= 80 && !isOver;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
            <span className="font-medium">{budget.category}</span>
            {isOver && <AlertCircle className="w-3 h-3 text-red-500" />}
        </div>
        <div className="text-muted-foreground">
          <span className={cn(isOver ? "text-red-500 font-bold" : "text-foreground font-medium")}>
            {formatCurrency(budget.spent)}
          </span>
          <span className="text-xs ml-1">/ {formatCurrency(budget.limit)}</span>
        </div>
      </div>
      
      <Progress 
        value={budget.percentage} 
        className="h-2" 
        indicatorClassName={cn(
            isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
        )}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
         <span>{budget.percentage.toFixed(0)}% Terpakai</span>
         <span>Sisa: {formatCurrency(Math.max(budget.remaining, 0))}</span>
      </div>
    </div>
  )
}

function ManageBudgetDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [setBudget, { isLoading }] = useSetBudgetMutation();
    const [deleteBudget] = useDeleteBudgetMutation(); // Opsional: jika ingin hapus di sini
    
    // Ambil ulang data untuk list hapus
    const { data } = useGetBudgetsQuery();
    const existingBudgets = data?.data || [];

    const handleSave = async () => {
        if(!category || !amount) return;
        try {
            await setBudget({ category, amount: parseFloat(amount) }).unwrap();
            toast.success("Anggaran disimpan");
            setCategory("");
            setAmount("");
            setOpen(false);
        } catch(e) { toast.error("Gagal menyimpan"); }
    };

    const handleDelete = async (id: string) => {
        await deleteBudget(id);
        toast.success("Anggaran dihapus");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerText ? (
                    <Button variant="outline" size="sm" className="h-8">{triggerText}</Button>
                ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kelola Anggaran</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                    {/* Form Tambah */}
                    <div className="grid gap-3 p-4 border rounded-lg bg-muted/20">
                        <Label>Tambah / Update Target</Label>
                        <div className="grid grid-cols-2 gap-3">
                             <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
                                <SelectContent>
                                    {EXPENSE_CATEGORIES.map((c: any) => (
                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                             <CurrencyInputField 
                             name="amount"
                                value={amount} 
                                onValueChange={(v) => setAmount(v || "")} 
                                placeholder="Rp 0"
                             />
                        </div>
                        <Button onClick={handleSave} disabled={isLoading} size="sm">Simpan Target</Button>
                    </div>

                    {/* List Existing (untuk hapus) */}
                    {existingBudgets.length > 0 && (
                        <div className="space-y-2">
                            <Label>Anggaran Aktif</Label>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {existingBudgets.map(b => (
                                    <div key={b._id} className="flex items-center justify-between text-sm p-2 border rounded hover:bg-muted">
                                        <span>{b.category} ({formatCurrency(b.limit)})</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDelete(b._id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}