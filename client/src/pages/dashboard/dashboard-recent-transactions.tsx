import { Link } from "react-router-dom"
import TransactionTable from "@/components/transaction/transaction-table"
import { Button } from "@/components/ui/button"
import { Card,CardAction,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { cn } from "@/lib/utils"

const DashboardRecentTransactions = () => {
  return (
   <Card className={cn(
       "bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-lg rounded-lg border border-white/20 dark:border-gray-700/40 transition-all hover:bg-white/70 dark:hover:bg-gray-800/70" // Border solid standar
    
     )}>
    <CardHeader className="!pb-0">
      <CardTitle className="text-xl">Transaksi Terbaru</CardTitle>
      <CardDescription>Menampilkan semua transaksi terbaru</CardDescription>
      <CardAction>
        <Button asChild variant="link" className="!text-gray-700 dark:!text-gray-200 !font-normal">
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>Lihat semua</Link>
        </Button>
      </CardAction>
      <Separator className="mt-3 !bg-gray-100 dark:!bg-gray-800" />
      </CardHeader>
      <CardContent className="pt-0">
        <TransactionTable 
        pageSize={5}
        isShowPagination={false} />
      </CardContent>
    </Card>
  )
}

export default DashboardRecentTransactions