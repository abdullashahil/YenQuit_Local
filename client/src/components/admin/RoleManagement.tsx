import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Shield, Search, Users, Crown, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { roleManagementService } from "../../services/roleManagementService";

interface Admin {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
}

export function RoleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await roleManagementService.getAdmins();
      if (response.success) {
        setAdmins(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async (email: string) => {
    if (!email) {
      setSearchedUser(null);
      return;
    }

    try {
      setUserSearchLoading(true);
      setError("");

      // Get all non-admin users and filter by email
      const response = await roleManagementService.getNonAdminUsers();
      if (response.success) {
        const user = response.data.find(u => u.email.toLowerCase() === email.toLowerCase());
        setSearchedUser(user || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to search user");
      setSearchedUser(null);
    } finally {
      setUserSearchLoading(false);
    }
  };

  const handlePromoteUser = async (userId: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await roleManagementService.promoteUser(userId);

      if (response.success) {
        setSuccess("User promoted to admin successfully!");
        setSearchedUser(null);
        loadAdmins();
      }
    } catch (err: any) {
      setError(err.message || "Failed to promote user");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to demote this admin to a regular user?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await roleManagementService.demoteAdmin(adminId);

      if (response.success) {
        setSuccess("Admin demoted to user successfully!");
        loadAdmins();
      }
    } catch (err: any) {
      setError(err.message || "Failed to demote admin");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    (admin.full_name && admin.full_name.toLowerCase().includes(adminSearchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            Manage admin roles and permissions
          </p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search admins..."
              value={adminSearchTerm}
              onChange={(e) => setAdminSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl h-12"
              style={{ borderColor: "#D9534F40" }}
            />
          </div>
        </div>

        {/* Admins Table */}
        <Card className="rounded-2xl border-0 shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1C3B5E20]">
                <Shield className="w-5 h-5 text-[#1C3B5E]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1C3B5E]">Administrators</h3>
                <p className="text-sm text-gray-600">{filteredAdmins.length} admin(s) total</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No admins found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1C3B5E20] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-[#1C3B5E]" />
                          </div>
                          <div>
                            <div className="font-medium">{admin.full_name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">ID: {admin.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#1C3B5E20] text-[#1C3B5E]">
                          {admin.role}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(admin.created_at)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {admin.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDemoteAdmin(admin.id)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Demote
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* User Search Section */}
        <Card className="rounded-2xl border-0 shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#20B2AA20]">
                <Crown className="w-5 h-5 text-[#20B2AA]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1C3B5E]">Promote User to Admin</h3>
                <p className="text-sm text-gray-600">Search for a user to promote to admin role</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#1C3B5E]">User Email</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchUser(e.target.value);
                  }}
                  className="pl-10 rounded-2xl h-12"
                  style={{ borderColor: "#D9534F40" }}
                />
              </div>
            </div>

            {userSearchLoading && (
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-gray-50 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            )}

            {searchedUser && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#20B2AA20] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#20B2AA]" />
                    </div>
                    <div>
                      <div className="font-medium">{searchedUser.full_name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{searchedUser.email}</div>
                      <div className="text-xs text-gray-400">ID: {searchedUser.id}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePromoteUser(searchedUser.id)}
                    size="sm"
                    className="rounded-xl"
                    style={{ backgroundColor: "#20B2AA" }}
                  >
                    Promote to Admin
                  </Button>
                </div>
              </div>
            )}

            {searchTerm && !userSearchLoading && !searchedUser && (
              <div className="text-center py-4">
                <p className="text-gray-500">No user found with this email address</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
