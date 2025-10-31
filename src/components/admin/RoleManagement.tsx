
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
import { Shield, UserPlus, X, Search, Filter } from "lucide-react";
import { useState } from "react";

export function RoleManagement() {
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const admins = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@admin.com",
      role: "Admin",
      addedDate: "Jan 15, 2025",
      status: "Active",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@admin.com",
      role: "Co-Admin",
      addedDate: "Mar 10, 2025",
      status: "Active",
      lastActive: "30 minutes ago"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@admin.com",
      role: "Admin",
      addedDate: "Jun 5, 2025",
      status: "Away",
      lastActive: "1 day ago"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@admin.com",
      role: "Co-Admin",
      addedDate: "Aug 20, 2025",
      status: "Active",
      lastActive: "5 hours ago"
    },
  ];

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusColor = (status: string) => {
    if (status === "Active") return "#8BC34A";
    if (status === "Away") return "#FFA500";
    return "#D9534F";
  };

  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold" style={{ color: "#1C3B5E" }}>
            Role Management
          </h2>
          <p className="text-lg" style={{ color: "#333333", opacity: 0.7 }}>
            Manage admin accounts and their access levels
          </p>
        </div>

        {/* Role Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: "#1C3B5E20" }}>
                <Shield className="w-6 h-6" style={{ color: "#1C3B5E" }} />
              </div>
              <div>
                <h4 className="text-lg font-semibold" style={{ color: "#1C3B5E" }}>
                  Admin
                </h4>
                <p className="text-sm mt-1" style={{ color: "#333333", opacity: 0.7 }}>
                  Full system access including user management, content, and all settings
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: "#20B2AA20" }}>
                <Shield className="w-6 h-6" style={{ color: "#20B2AA" }} />
              </div>
              <div>
                <h4 className="text-lg font-semibold" style={{ color: "#20B2AA" }}>
                  Co-Admin
                </h4>
                <p className="text-sm mt-1" style={{ color: "#333333", opacity: 0.7 }}>
                  Limited access to content management and user support functions
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin List */}
        <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: "#20B2AA20" }}>
                <Shield className="w-6 h-6" style={{ color: "#20B2AA" }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
                  Admin Accounts
                </h3>
                <p className="text-sm mt-1" style={{ color: "#333333", opacity: 0.7 }}>
                  {admins.length} active administrators in the system
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 rounded-2xl border-gray-200 h-12 w-full lg:w-64"
                />
              </div>
              <Button
                onClick={() => setIsAddAdminModalOpen(true)}
                className="px-6 py-3 rounded-2xl text-white font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: "#20B2AA" }}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add New Admin
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100" style={{ backgroundColor: "#f8f8f8" }}>
                  <TableHead className="text-left py-6 font-semibold" style={{ color: "#1C3B5E" }}>
                    Administrator
                  </TableHead>
                  <TableHead className="text-left font-semibold" style={{ color: "#1C3B5E" }}>
                    Role
                  </TableHead>
                  <TableHead className="text-center font-semibold" style={{ color: "#1C3B5E" }}>
                    Status
                  </TableHead>
                  <TableHead className="text-center font-semibold" style={{ color: "#1C3B5E" }}>
                    Added Date
                  </TableHead>
                  <TableHead className="text-center font-semibold" style={{ color: "#1C3B5E" }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin, index) => (
                  <TableRow
                    key={admin.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-5">
                      <div>
                        <p className="text-base font-semibold" style={{ color: "#1C3B5E" }}>
                          {admin.name}
                        </p>
                        <p className="text-sm mt-1" style={{ color: "#333333", opacity: 0.7 }}>
                          {admin.email}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#333333", opacity: 0.5 }}>
                          Last active: {admin.lastActive}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium"
                        style={{
                          backgroundColor: `${getRoleColor(admin.role)}20`,
                          color: getRoleColor(admin.role),
                        }}
                      >
                        {admin.role}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <div
                          className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(admin.status)}20`,
                            color: getStatusColor(admin.status),
                          }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: getStatusColor(admin.status) }}
                          />
                          {admin.status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="text-sm font-medium" style={{ color: "#333333", opacity: 0.8 }}>
                        {admin.addedDate}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Select defaultValue={admin.role}>
                          <SelectTrigger className="w-40 h-10 rounded-2xl border-gray-200 focus:border-[#20B2AA] transition-colors">
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
        <div className="flex justify-center">
          <Button
            className="px-12 py-6 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Add Admin Modal */}
      <Dialog open={isAddAdminModalOpen} onOpenChange={setIsAddAdminModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#1C3B5E" }}>
                Add New Admin
              </h2>
              <p className="text-lg" style={{ color: "#333333", opacity: 0.7 }}>
                Create a new administrator account
              </p>
            </div>
            <button
              onClick={() => setIsAddAdminModalOpen(false)}
              className="p-3 rounded-2xl hover:bg-gray-100 transition-all"
            >
              <X className="w-6 h-6" style={{ color: "#333333" }} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
                Full Name <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Input
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Enter admin name"
                className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
                Email Address <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
                Assign Role <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] transition-colors">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Co-Admin">Co-Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <Button
              onClick={() => setIsAddAdminModalOpen(false)}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-gray-100 transition-all border border-gray-200 font-semibold"
              style={{ color: "#333333" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              className="px-8 py-4 rounded-2xl text-white font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
              style={{ backgroundColor: "#20B2AA" }}
            >
              Add Administrator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
