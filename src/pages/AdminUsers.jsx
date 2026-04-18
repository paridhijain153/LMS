import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/admin-management.css";

function formatRole(role) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

const initialUserForm = {
  name: "",
  email: "",
  role: "student",
  status: "active",
};

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, isHydrated } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState(initialUserForm);
  const [editingUserId, setEditingUserId] = useState("");
  const [editDraft, setEditDraft] = useState(initialUserForm);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );
  }, [searchQuery, users]);

  const onNewUserChange = (field) => (event) => {
    setNewUser((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onEditChange = (field) => (event) => {
    setEditDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddUser = (event) => {
    event.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Missing fields",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    addUser(newUser);
    setNewUser(initialUserForm);
    toast({ title: "User added", description: "New user has been created successfully." });
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditDraft({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const saveEdit = (userId) => {
    if (!editDraft.name.trim() || !editDraft.email.trim()) {
      toast({
        title: "Missing fields",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    updateUser(userId, {
      name: editDraft.name.trim(),
      email: editDraft.email.trim().toLowerCase(),
      role: editDraft.role,
      status: editDraft.status,
    });
    setEditingUserId("");
    toast({ title: "User updated", description: "Changes were saved successfully." });
  };

  const removeUser = (userId) => {
    deleteUser(userId);
    toast({ title: "User deleted", description: "User removed from admin list." });
  };

  return (
    <DashboardLayout role="admin">
      <TopBar
        title="Manage Users"
        subtitle="Edit roles, suspend accounts, and maintain the user list."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, email, or role"
      />

      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading users"
            description="Fetching user records and access roles."
          />
        ) : (
          <>
        <section className="admin-card">
          <h2 className="admin-card__title">Add New User</h2>
          <form className="admin-form-grid" onSubmit={handleAddUser}>
            <div>
              <label className="admin-field-label" htmlFor="new-user-name">Name</label>
              <Input
                id="new-user-name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={onNewUserChange("name")}
              />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-user-email">Email</label>
              <Input
                id="new-user-email"
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={onNewUserChange("email")}
              />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-user-role">Role</label>
              <select id="new-user-role" className="admin-select" value={newUser.role} onChange={onNewUserChange("role")}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-user-status">Status</label>
              <select id="new-user-status" className="admin-select" value={newUser.status} onChange={onNewUserChange("status")}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="form-field--full">
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </section>

        <section className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Users ({filteredUsers.length})</h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isEditing = editingUserId === user.id;

                  return (
                    <tr key={user.id}>
                      <td>
                        {isEditing ? (
                          <Input value={editDraft.name} onChange={onEditChange("name")} />
                        ) : (
                          <span className="table-user-name">{user.name}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <Input value={editDraft.email} onChange={onEditChange("email")} />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select className="admin-select" value={editDraft.role} onChange={onEditChange("role")}>
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          formatRole(user.role)
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select className="admin-select" value={editDraft.status} onChange={onEditChange("status")}>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        ) : (
                          <span
                            className={`admin-table-badge ${
                              user.status === "active"
                                ? "admin-table-badge--active"
                                : "admin-table-badge--suspended"
                            }`}
                          >
                            {formatRole(user.status)}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="admin-inline-actions">
                          {isEditing ? (
                            <>
                              <Button size="sm" onClick={() => saveEdit(user.id)}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingUserId("")}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => startEditing(user)}>Edit</Button>
                              <Button size="sm" variant="outline" onClick={() => toggleUserStatus(user.id)}>
                                {user.status === "active" ? "Suspend" : "Activate"}
                              </Button>
                              <ConfirmActionButton
                                triggerLabel="Delete"
                                title="Delete user"
                                description={`This will permanently remove ${user.name} from the admin list.`}
                                confirmLabel="Delete user"
                                onConfirm={() => removeUser(user.id)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <PageState
                type="empty"
                title="No users found"
                description="Try a different search term or create a new user above."
              />
            )}
          </div>
        </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
