import { Dialog, DialogContent } from "../ui/dialog";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  Award,
  Clock
} from "lucide-react";
import { Card } from "../ui/card";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function UserDetailModal({ open, onOpenChange, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.name?.split(' ').map(n => n[0]).join('') || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  user.status === 'Active' ? 'bg-green-500' : 
                  user.status === 'Quit' ? 'bg-blue-500' : 'bg-red-500'
                }`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1C3B5E]">{user.name || 'User Details'}</h2>
                <p className="text-sm text-gray-600 mt-1">User information</p>
              </div>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-2xl hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Information */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Email</p>
                  <p className="text-sm text-[#1C3B5E] break-all">{user.email || '-'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-green-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-100">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Phone</p>
                  <p className="text-sm text-[#1C3B5E]">{user.phone || '-'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-orange-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Age</p>
                  <p className="text-sm text-[#1C3B5E]">{user.age ? `${user.age} years` : '-'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-purple-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Member Since</p>
                  <p className="text-sm text-[#1C3B5E]">{user.joinDate || '-'}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-teal-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-100">
                  <Target className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Fagerström Score</p>
                  <p className="text-lg font-bold text-[#1C3B5E]">{user.fagerstrom || '-'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Status</p>
                  <p className="text-lg font-bold text-[#20B2AA]">{user.status || '-'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Engagement</p>
                  <p className="text-lg font-bold text-[#1C3B5E]">{user.engagement || '-'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}