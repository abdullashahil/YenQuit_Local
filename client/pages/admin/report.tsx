import { useState, useEffect } from "react";
import { AdminLayout } from "../../src/components/layouts/AdminLayout";
import {
  Users,
  FileText,
  Activity,
  ClipboardList,
  MessageSquare,
  BarChart,
  Database,
  ArrowLeft,
  Download
} from "lucide-react";

// Types
type ReportType =
  | "user_details"
  | "smokeless_as"
  | "smoked_as"
  | "smokeless_fagerstrom"
  | "smoked_fagerstrom"
  | "pre_efficacy"
  | "post_efficacy"
  | "feedback"
  | "rs"
  | "daily_logs"
  | "content_seekings";

interface ReportBlock {
  id: ReportType;
  title: string;
  icon: any;
  description: string;
}

const reportBlocks: ReportBlock[] = [
  { id: "user_details", title: "User Details", icon: Users, description: "General user information and profiles" },
  { id: "smokeless_as", title: "Smokeless A's", icon: FileText, description: "Smokeless assessment records" },
  { id: "smoked_as", title: "Smoked A's", icon: FileText, description: "Smoked assessment records" },
  { id: "smokeless_fagerstrom", title: "Smokeless Fagerstrom", icon: Activity, description: "Nicotine dependence tests (Smokeless)" },
  { id: "smoked_fagerstrom", title: "Smoked Fagerstrom", icon: Activity, description: "Nicotine dependence tests (Smoked)" },
  { id: "pre_efficacy", title: "Pre Efficacy", icon: BarChart, description: "Pre-intervention efficacy scores" },
  { id: "post_efficacy", title: "Post Efficacy", icon: BarChart, description: "Post-intervention efficacy scores" },
  { id: "feedback", title: "Feedback", icon: MessageSquare, description: "User feedback and surveys" },
  { id: "rs", title: "R's", icon: ClipboardList, description: "5R's progress tracking" },
  { id: "daily_logs", title: "Daily Logs", icon: Database, description: "Daily user activity logs" },
  { id: "content_seekings", title: "Content Seekings", icon: FileText, description: "Content consumption records" },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedReport) {
      fetchReportData(selectedReport);
    }
  }, [selectedReport]);

  const fetchReportData = async (type: ReportType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      // Use absolute URL to avoid 404 on client side transition
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/reports/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      let finalData = Array.isArray(result) ? result : [];

      if (type === "user_details") {
        const targetOrder = [
          "id", "full_name", "email", "tobacco_type", "age", "gender", "phone",
          "place", "setting", "role", "onboarding_completed", "join_date",
          "quit_date", "fagerstrom_score", "smokerType", "isStudent",
          "yearOfStudy", "streamOfStudy", "systemicHealthIssue"
        ];

        finalData = finalData.map(user => {
          const normalized: any = {};
          const userMeta = user.profile_metadata || {};
          const formatVal = (val: any) => (val === null || val === undefined) ? "null" : val;

          targetOrder.forEach(key => {
            let val;
            if (key in user) {
              val = user[key];
            } else if (key in userMeta) {
              val = userMeta[key];
            } else {
              val = null;
            }
            normalized[key] = formatVal(val);
          });
          return normalized;
        });
      }

      setData(finalData);
    } catch (error) {
      console.error("Error fetching report:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).map(k => k.replace(/_/g, " ").toUpperCase()).join(",");
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers + "\n"
      + data.map(row => Object.values(row).map(val => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout activeTab="reports">
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white">
        <div className="lg:ml-10">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-full mx-auto">

              <div className="mb-6 md:mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedReport && (
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="p-2 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow text-gray-500 hover:text-[#1C3B5E]"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                  )}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#1C3B5E]">
                      {selectedReport ? reportBlocks.find(r => r.id === selectedReport)?.title : "Reports"}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                      {selectedReport
                        ? "View detailed data for this category"
                        : "Select a category to view detailed reports and export data"}
                    </p>
                  </div>
                </div>

                {selectedReport && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-medium">Export CSV</span>
                  </button>
                )}
              </div>

              {!selectedReport ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {reportBlocks.map((block) => {
                    const Icon = block.icon;
                    return (
                      <button
                        key={block.id}
                        onClick={() => setSelectedReport(block.id)}
                        className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-left group hover:-translate-y-1"
                      >
                        <div className="p-3 rounded-2xl bg-[#20B2AA]/10 text-[#20B2AA] mb-4 group-hover:bg-[#20B2AA] group-hover:text-white transition-colors duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1C3B5E] mb-1">{block.title}</h3>
                        <p className="text-sm text-gray-500">{block.description}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 overflow-hidden">
                  {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA]"></div>
                      <p className="text-gray-600">Loading report data...</p>
                    </div>
                  ) : data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-xs uppercase font-bold text-[#1C3B5E]">
                          <tr>
                            {Object.keys(data[0]).map((key) => (
                              <th key={key} className="px-6 py-4 whitespace-nowrap tracking-wider">{key.replace(/_/g, " ")}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {data.map((row, index) => (
                            <tr key={index} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/30">
                              {Object.values(row).map((val: any, i) => (
                                <td key={i} className="px-6 py-4 whitespace-nowrap">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-gray-50">
                        <Database className="w-8 h-8 text-gray-300" />
                      </div>
                      <p>No data available for this report.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
