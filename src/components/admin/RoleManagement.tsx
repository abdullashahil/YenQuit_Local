import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Shield, UserPlus, X } from "lucide-react";
import { useState } from "react";

export function RoleManagement() {
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("");

  const admins = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@admin.com",
      role: "Admin",
      addedDate: "Jan 15, 2025",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@admin.com",
      role: "Co-Admin",
      addedDate: "Mar 10, 2025",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@admin.com",
      role: "Admin",
      addedDate: "Jun 5, 2025",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@admin.com",
      role: "Co-Admin",
      addedDate: "Aug 20, 2025",
    },
  ];

  const handleAddAdmin = () => {
    console.log({ newAdminName, newAdminEmail, newAdminRole });
    setIsAddAdminModalOpen(false);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminRole("");
  };

  const getRoleColor = (role: string) => {
    if (role === "Admin") return "#1C3B5E";
    if (role === "Co-Admin") return "#20B2AA";
    return "#20B2AA";
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
            Role Management
          </h2>
          <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
            Manage admin accounts and their access levels
          </p>
        </div>

        {/* Role Descriptions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 rounded-2xl border-0 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: "#1C3B5E" }} />
              <h4 className="text-sm" style={{ color: "#1C3B5E" }}>
                Admin
              </h4>
            </div>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Full system access including user management, content, and all settings
            </p>
          </Card>

          <Card className="p-4 rounded-2xl border-0 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: "#20B2AA" }} />
              <h4 className="text-sm" style={{ color: "#20B2AA" }}>
                Co-Admin
              </h4>
            </div>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Limited access to content management and user support functions
            </p>
          </Card>
        </div>

        {/* Admin List */}
        <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "#20B2AA20" }}
              >
                <Shield className="w-5 h-5" style={{ color: "#20B2AA" }} />
              </div>
              <div>
                <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
                  Admin Accounts
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "#333333", opacity: 0.6 }}>
                  {admins.length} active administrators
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddAdminModalOpen(true)}
              className="px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#20B2AA" }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Admin
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100" style={{ backgroundColor: "#f8f8f8" }}>
                  <TableHead className="text-left py-4" style={{ color: "#1C3B5E" }}>
                    Name
                  </TableHead>
                  <TableHead className="text-left" style={{ color: "#1C3B5E" }}>
                    Email
                  </TableHead>
                  <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                    Current Role
                  </TableHead>
                  <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                    Added Date
                  </TableHead>
                  <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                    Change Role
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin, index) => (
                  <TableRow
                    key={admin.id}
                    className="border-b border-gray-50"
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                    }}
                  >
                    <TableCell className="py-4">
                      <p className="text-sm" style={{ color: "#1C3B5E" }}>
                        {admin.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                        {admin.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className="inline-block px-3 py-1 rounded-xl text-xs"
                        style={{
                          backgroundColor: `${getRoleColor(admin.role)}20`,
                          color: getRoleColor(admin.role),
                        }}
                      >
                        {admin.role}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                        {admin.addedDate}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Select defaultValue={admin.role}>
                          <SelectTrigger className="w-40 h-10 rounded-xl border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Co-Admin">Co-Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Add Admin Modal */}
      <Dialog open={isAddAdminModalOpen} onOpenChange={setIsAddAdminModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>
                Add New Admin
              </h2>
              <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
                Create a new administrator account
              </p>
            </div>
            <button
              onClick={() => setIsAddAdminModalOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" style={{ color: "#333333" }} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Full Name <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Input
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Enter admin name"
                className="rounded-2xl border-gray-200 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Email Address <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="rounded-2xl border-gray-200 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Assign Role <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Co-Admin">Co-Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <Button
              onClick={() => setIsAddAdminModalOpen(false)}
              className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all"
              style={{ color: "#333333" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#20B2AA" }}
            >
              Add Admin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
