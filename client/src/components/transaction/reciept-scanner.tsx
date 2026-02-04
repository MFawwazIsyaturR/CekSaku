import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScanText, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AIScanReceiptData } from "@/features/transaction/transationType";
import { toast } from "sonner";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useAiScanReceiptMutation } from "@/features/transaction/transactionAPI";
import { useTypedSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateCredentials } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/app/hook";

interface ReceiptScannerProps {
  loadingChange: boolean;
  onScanComplete: (data: AIScanReceiptData) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const ReceiptScanner = ({
  loadingChange,
  onScanComplete,
  onLoadingChange,
}: ReceiptScannerProps) => {
  const [receipt, setReceipt] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);

  const isPro = user?.subscriptionStatus === 'active';
  // Default to 10 if undefined (for existing users who haven't been migrated yet)
  const remainingQuota = user?.aiScanQuota ?? 10;
  const isQuotaEmpty = remainingQuota <= 0;

  const {
    progress,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const [aiScanReceipt] = useAiScanReceiptMutation()


  const handleReceiptUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const formData = new FormData();
    formData.append("receipt", file);

    startProgress(10);
    onLoadingChange(true);
    // Simulate file upload and processing
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setReceipt(result);

      // Simulate scanning progress
      // Start progress
      let currentProgress = 10;
      const interval = setInterval(() => {
        const increment = currentProgress < 90 ? 10 : 1;
        currentProgress = Math.min(currentProgress + increment, 90);
        updateProgress(currentProgress);
      }, 250);




      aiScanReceipt(formData).unwrap().then((res) => {
        updateProgress(100)
        onScanComplete(res.data);

        // Update quota in Redux
        if (typeof res.remainingQuota === 'number') {
          dispatch(updateCredentials({
            user: { ...user, aiScanQuota: res.remainingQuota }
          }));
        }

        toast.success("Struk berhasil dipindai");
      }).catch((error) => {
        // Handle specific quota error
        if (error.status === 403 && error.data?.error === "QUOTA_EXCEEDED") {
          toast.error(error.data.message || "Kuota pemindaian habis");
          dispatch(updateCredentials({
            user: { ...user, aiScanQuota: 0 }
          }));
        } else {
          toast.error(error.data?.message || "Gagal memindai struk");
        }
      })
        .finally(() => {
          clearInterval(interval);
          doneProgress();
          resetProgress();
          setReceipt(null);
          onLoadingChange(false);
        })
    };
    reader.readAsDataURL(file);
  };

  // Show upgrade prompt for non-Pro users
  if (!isPro) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">AI Pemindai Struk</Label>
        <div className="flex items-center gap-3 border rounded-lg p-4 bg-muted/30 border-dashed">
          <div className="h-12 w-12 rounded-md border bg-muted flex items-center justify-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Fitur Pro</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upgrade ke Pro untuk menggunakan AI Pemindai Struk
            </p>
            <Button
              variant="link"
              className="h-auto p-0 text-xs text-primary mt-1"
              onClick={() => navigate('/billing')}
            >
              Upgrade Sekarang →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">AI Pemindai Struk</Label>
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          isQuotaEmpty ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
        )}>
          {remainingQuota}/10 Scan
        </span>
      </div>
      <div className="flex items-start gap-3 border-b pb-4">
        {/* Receipt Preview */}
        <div
          className={`h-12 w-12 rounded-md border bg-cover bg-center ${!receipt ? "bg-muted" : ""
            }`}
          style={receipt ? { backgroundImage: `url(${receipt})` } : {}}
        >
          {!receipt && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ScanText color="currentColor" className="h-5 w-5 !stroke-1.5" />
            </div>
          )}
        </div>

        {/* Upload Input or Progress */}
        <div className="flex-1">
          {!loadingChange ? (
            <>
              <Input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="max-w-[250px] px-1 h-9 cursor-pointer text-sm file:mr-2 
            file:rounded file:border-0 file:bg-primary file:px-3 file:py-px
             file:text-sm file:font-medium file:text-white 
             hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingChange || isQuotaEmpty}
              />
              <p className={cn("mt-2 text-[11px] px-2", isQuotaEmpty ? "text-red-500 font-medium" : "text-muted-foreground")}>
                {isQuotaEmpty ? "Kuota habis. Reset tgl 1." : "JPG, PNG hingga 5MB"}
              </p>
            </>
          ) : (
            <div className="space-y-2 pt-3">
              <Progress value={progress} className="h-2 w-[250px]" />
              <p className="text-xs text-muted-foreground">
                Scanning receipt... {progress}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;

