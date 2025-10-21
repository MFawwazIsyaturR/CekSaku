import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";

interface LogoutDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    startTransition(() => {
      setIsOpen(false);
      dispatch(logout());
      navigate(AUTH_ROUTES.LANDING);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah anda yakin ingin keluar?</DialogTitle>
          <DialogDescription>
            Ini akan mengakhiri sesi Anda saat ini dan Anda perlu masuk kembali untuk mengakses akun Anda.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Tidak
          </Button>
          <Button
            className="text-white !bg-red-500"
            disabled={isPending}
            type="button"
            onClick={handleLogout}
          >
            {isPending && <Loader className="animate-spin mr-2" />}
            Ya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
