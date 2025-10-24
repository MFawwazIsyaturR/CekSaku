import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";

const AppLayout = () => {
  return (
    <>
      {/* Container utama tetap flex */}
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Terapkan gradasi di sini */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
      <EditTransactionDrawer />
    </>
  );
};

export default AppLayout;