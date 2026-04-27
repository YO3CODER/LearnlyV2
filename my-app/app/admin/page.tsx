import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import AdminWrapper from "./AdminWrapper";

const AdminPage = async () => {
  if (!isAdmin()) {
    redirect("/");
  }

  return <AdminWrapper />;
};

export default AdminPage;