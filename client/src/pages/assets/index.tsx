import { Wallet, TrendingUp, Building2, PiggyBank, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AddAssetDrawer from "./_components/add-asset-drawer";
import { useGetAllAssetsQuery, useDeleteAssetMutation } from "@/features/asset/assetAPI";
import { AssetCategory } from "@/features/asset/assetType";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

const CATEGORY_COLORS = {
  cash: "#3b82f6",       // blue-500
  investment: "#10b981", // emerald-500
  property: "#f59e0b",   // amber-500
  crypto: "#8b5cf6",     // violet-500
};

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  cash: "Kas & Bank",
  investment: "Investasi",
  property: "Aset Tetap",
  crypto: "Kripto",
};

export default function AssetsPage() {
  // 1. Menggunakan Hook RTK Query untuk mengambil data real
  const { data, isLoading, isError } = useGetAllAssetsQuery();
  
  const assets = data?.data?.assets || [];
  const totalNetWorth = data?.data?.totalNetWorth || 0;

  // Hitung Total per Kategori untuk Grafik
  const allocationData = Object.keys(CATEGORY_LABELS).map((key) => {
    const category = key as AssetCategory;
    return {
      name: CATEGORY_LABELS[category],
      value: assets
        .filter((a) => a.category === category)
        .reduce((sum, a) => sum + a.amount, 0),
      color: CATEGORY_COLORS[category],
    };
  }).filter(item => item.value > 0);

  if (isLoading) {
      return (
          <div className="flex h-[50vh] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      );
  }

  if (isError) {
      return (
          <div className="p-8 text-center text-red-500">
              Gagal memuat data aset. Silakan coba lagi nanti.
          </div>
      );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[var(--max-width)] mx-auto pb-24">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            Portofolio Aset
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola dan pantau pertumbuhan kekayaan Anda di satu tempat.
          </p>
        </div>
        <AddAssetDrawer />
      </div>

      {/* --- Ringkasan Kekayaan (Net Worth Card) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Total Balance & Chart */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-xl relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
                        <PiggyBank className="w-3.5 h-3.5" />
                        <span>Total Kekayaan Bersih</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {formatCurrency(totalNetWorth, { decimalPlaces: 0 })}
                    </h2>
                    <p className="text-blue-100 text-sm max-w-md">
                        Akumulasi dari seluruh rekening bank, dompet digital, dan portofolio investasi Anda saat ini.
                    </p>
                </div>

                {/* Donut Chart */}
                {totalNetWorth > 0 && (
                    <div className="w-40 h-40 flex-shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={allocationData}
                            dataKey="value"
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={5}
                            stroke="none"
                        >
                            {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value, {compact: true})}
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-medium opacity-80">Alokasi</span>
                    </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Kolom Kanan: Statistik Cepat */}
        <div className="grid grid-cols-1 gap-4">
            <StatCard 
                title="Kas & Likuid" 
                amount={allocationData.find(d => d.name === CATEGORY_LABELS.cash)?.value || 0} 
                icon={Wallet} 
                color="text-blue-500" 
                bgColor="bg-blue-500/10"
            />
            <StatCard 
                title="Investasi" 
                amount={allocationData.find(d => d.name === CATEGORY_LABELS.investment)?.value || 0} 
                icon={TrendingUp} 
                color="text-emerald-500" 
                bgColor="bg-emerald-500/10"
            />
             <StatCard 
                title="Aset Lainnya" 
                amount={(allocationData.find(d => d.name === CATEGORY_LABELS.property)?.value || 0) + (allocationData.find(d => d.name === CATEGORY_LABELS.crypto)?.value || 0)} 
                icon={Building2} 
                color="text-amber-500" 
                bgColor="bg-amber-500/10"
            />
        </div>
      </div>

      <Separator />

      {/* --- Daftar Aset --- */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Daftar Aset Anda</h3>
        
        {assets.length === 0 ? (
            <EmptyState 
                title="Belum ada aset" 
                description="Tambahkan aset pertama Anda untuk mulai melacak kekayaan." 
                icon={Wallet}
            />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
                <AssetItemCard key={asset._id} asset={asset} />
            ))}
            </div>
        )}
      </div>

    </div>
  );
}

// --- Sub-Komponen ---

function StatCard({ title, amount, icon: Icon, color, bgColor }: { title: string, amount: number, icon: any, color: string, bgColor: string }) {
    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{title}</p>
                    <p className="text-xl font-semibold">{formatCurrency(amount, { compact: true })}</p>
                </div>
                <div className={cn("p-3 rounded-xl", bgColor)}>
                    <Icon className={cn("w-5 h-5", color)} />
                </div>
            </CardContent>
        </Card>
    )
}

function AssetItemCard({ asset }: { asset: any }) { // Ganti 'any' dengan tipe Asset import jika perlu
    const [deleteAsset, { isLoading: isDeleting }] = useDeleteAssetMutation();
    
    const handleDelete = () => {
        deleteAsset(asset._id)
        .unwrap()
        .then(() => toast.success("Aset berhasil dihapus"))
        .catch(() => toast.error("Gagal menghapus aset"));
    };

    const Icon = asset.category === 'cash' ? Wallet : 
                 asset.category === 'investment' ? TrendingUp :
                 asset.category === 'crypto' ? Wallet : Building2;
                 
    return (
        <Card className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all cursor-default relative">
             {/* Tombol Hapus (Muncul saat hover) */}
             <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Aset?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus <strong>{asset.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", 
                            asset.category === 'cash' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                            asset.category === 'investment' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-sm line-clamp-1" title={asset.name}>{asset.name}</h4>
                            <p className="text-xs text-muted-foreground">{asset.institution || "-"}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground mb-1">Nilai Sekarang</p>
                    <p className="text-xl font-bold tracking-tight">{formatCurrency(asset.amount)}</p>
                </div>
            </CardContent>
        </Card>
    )
}