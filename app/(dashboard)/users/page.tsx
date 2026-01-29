import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminUser } from "@/lib/services/auth";
import { getUsers } from "@/lib/services/users";
import { userStatuses, userTypes } from "@/types/user";

import { deleteUserAction, updateUserAction } from "./actions";
import { CreateUserForm } from "./components/create-user-form";

export default async function UsersPage() {
  const { dbUser } = await requireAdminUser();
  const users = await getUsers();

  return (
    <div className="grid gap-8">
      <CreateUserForm />

      <section className="grid gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">User directory</p>
          <h2 className="mt-2 font-serif text-2xl text-foreground">Manage access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update roles, activate users, or deactivate access when needed.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{user.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    Invited {user.invitedAt?.toLocaleDateString() ?? "—"}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.userType === "ADMIN" ? "admin" : "default"}>
                    {user.userType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "ACTIVE" ? "success" : "warning"}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <form action={updateUserAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="userType"
                      defaultValue={user.userType}
                      className="h-9 rounded-full border border-input bg-white/80 px-3 text-xs"
                    >
                      {userTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <select
                      name="status"
                      defaultValue={user.status}
                      className="h-9 rounded-full border border-input bg-white/80 px-3 text-xs"
                    >
                      {userStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" variant="outline">
                      Save
                    </Button>
                  </form>
                  <form action={deleteUserAction} className="mt-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      disabled={user.id === dbUser.id}
                    >
                      {user.id === dbUser.id ? "Cannot delete self" : "Deactivate"}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No users yet. Send an invite to get started.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
