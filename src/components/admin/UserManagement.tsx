import { AdminSidebar } from "./AdminSidebar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
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
import { UserDetailModal } from "./UserDetailModal";
import { Search, Eye, Edit, Trash2, Send, Download, UserPlus } from "lucide-react";
import { useState } from "react";

interface UserManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export function UserManagement({ activeTab, setActiveTab, onExitAdmin, onLogout }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addictionFilter, setAddictionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock user data
  const users = [
    {
      id: 1,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@email.com",
      age: 34,
      fagerstrom: 7,
      addictionLevel: "High",
      status: "Active",
      lastLogin: "Oct 16, 2025",
    },
    {
      id: 2,
      name: "James Thompson",
      email: "james.t@email.com",
      age: 28,
      fagerstrom: 4,
      addictionLevel: "Moderate",
      status: "Active",
      lastLogin: "Oct 15, 2025",
    },
    {
      id: 3,
      name: "Maria Garcia",
      email: "m.garcia@email.com",
      age: 41,
      fagerstrom: 2,
      addictionLevel: "Low",
      status: "Quit",
      lastLogin: "Oct 14, 2025",
    },
    {
      id: 4,
      name: "Robert Chen",
      email: "robert.chen@email.com",
      age: 52,
      fagerstrom: 8,
      addictionLevel: "High",
      status: "Active",
      lastLogin: "Oct 16, 2025",
    },
    {
      id: 5,
      name: "Emily Brown",
      email: "emily.brown@email.com",
      age: 31,
      fagerstrom: 5,
      addictionLevel: "Moderate",
      status: "Relapsed",
      lastLogin: "Oct 12, 2025",
    },
    {
      id: 6,
      name: "Michael Davis",
      email: "m.davis@email.com",
      age: 45,
      fagerstrom: 3,
      addictionLevel: "Low",
      status: "Active",
      lastLogin: "Oct 16, 2025",
    },
    {
      id: 7,
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      age: 38,
      fagerstrom: 6,
      addictionLevel: "Moderate",
      status: "Active",
      lastLogin: "Oct 15, 2025",
    },
    {
      id: 8,
      name: "David Wilson",
      email: "d.wilson@email.com",
      age: 29,
      fagerstrom: 9,
      addictionLevel: "High",
      status: "Active",
      lastLogin: "Oct 16, 2025",
    },
  ];

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAddiction =
      addictionFilter === "all" || user.addictionLevel === addictionFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesAddiction && matchesStatus;
  });

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const getAddictionColor = (level: string) => {
    if (level === "High") return "#D9534F";
    if (level === "Moderate") return "#FFA726";
    return "#8BC34A";
  };

  const getStatusColor = (status: string) => {
    if (status === "Quit") return "#8BC34A";
    if (status === "Relapsed") return "#D9534F";
    return "#20B2AA";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={onExitAdmin}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="ml-64 p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              User Management
            </h1>
            <p style={{ color: "#333333" }}>
              Manage user accounts, view progress, and provide personalized support
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="bg-white rounded-3xl shadow-lg border-0 p-6 mb-6">
            <div className="grid grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="col-span-5 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#20B2AA" }}
                />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-gray-200"
                />
              </div>

              {/* Addiction Level Filter */}
              <div className="col-span-3">
                <Select value={addictionFilter} onValueChange={setAddictionFilter}>
                  <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                    <SelectValue placeholder="Addiction Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="col-span-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Quit">Quit</SelectItem>
                    <SelectItem value="Relapsed">Relapsed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add User Button */}
              <div className="col-span-1">
                <Button
                  className="w-full h-12 rounded-2xl"
                  style={{ backgroundColor: "#20B2AA", color: "white" }}
                >
                  <UserPlus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm" style={{ color: "#333333", opacity: 0.7 }}>
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Main User Table */}
          <div className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
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
                      Age
                    </TableHead>
                    <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                      Fagerström Score
                    </TableHead>
                    <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                      Addiction Level
                    </TableHead>
                    <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                      Status
                    </TableHead>
                    <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                      Last Login
                    </TableHead>
                    <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                      }}
                    >
                      <TableCell className="py-4">
                        <p className="text-sm" style={{ color: "#1C3B5E" }}>
                          {user.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                          {user.email}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="text-sm" style={{ color: "#333333" }}>
                          {user.age}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className="inline-block px-3 py-1 rounded-xl text-sm"
                          style={{
                            backgroundColor: `${getAddictionColor(user.addictionLevel)}20`,
                            color: getAddictionColor(user.addictionLevel),
                          }}
                        >
                          {user.fagerstrom}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className="inline-block px-3 py-1 rounded-xl text-sm"
                          style={{
                            backgroundColor: `${getAddictionColor(user.addictionLevel)}20`,
                            color: getAddictionColor(user.addictionLevel),
                          }}
                        >
                          {user.addictionLevel}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className="inline-block px-3 py-1 rounded-xl text-sm"
                          style={{
                            backgroundColor: `${getStatusColor(user.status)}20`,
                            color: getStatusColor(user.status),
                          }}
                        >
                          {user.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                          {user.lastLogin}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {/* View Detailed Profile */}
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="p-2 rounded-xl transition-all hover:shadow-md"
                            style={{ backgroundColor: "#20B2AA20" }}
                            title="View Detailed Profile"
                          >
                            <Eye className="w-4 h-4" style={{ color: "#20B2AA" }} />
                          </button>

                          {/* Edit User */}
                          <button
                            className="p-2 rounded-xl transition-all hover:shadow-md hover:bg-gray-100"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" style={{ color: "#333333" }} />
                          </button>

                          {/* Delete User */}
                          <button
                            className="p-2 rounded-xl transition-all hover:shadow-md"
                            style={{ backgroundColor: "#D9534F20" }}
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" style={{ color: "#D9534F" }} />
                          </button>

                          {/* Send Personalized Advice */}
                          <button
                            className="p-2 rounded-xl transition-all hover:shadow-md"
                            style={{ backgroundColor: "#20B2AA20" }}
                            title="Send Personalized Advice"
                          >
                            <Send className="w-4 h-4" style={{ color: "#20B2AA" }} />
                          </button>

                          {/* Export User Data */}
                          <button
                            className="p-2 rounded-xl transition-all hover:shadow-md hover:bg-gray-100"
                            title="Export User Data"
                          >
                            <Download className="w-4 h-4" style={{ color: "#333333" }} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* No Results Message */}
            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                  No users found
                </p>
                <p className="text-sm" style={{ color: "#333333", opacity: 0.5 }}>
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        user={selectedUser}
      />
    </div>
  );
}
