import { redirect } from "next/navigation";

export default function ProtectedAdminLayout(): never {
  redirect("/admin/login");
}
