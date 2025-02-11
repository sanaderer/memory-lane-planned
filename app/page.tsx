import { UserSelection } from "@/components/user/UserSelector";
import { getAllUsers } from "@/lib/services/userService";

export default async function Home() {
  const users = await getAllUsers();

  return <UserSelection initialUsers={users} />;
}
