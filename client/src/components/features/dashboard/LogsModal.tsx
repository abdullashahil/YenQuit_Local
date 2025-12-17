import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { X, Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import quitTrackerService from "../../../services/quitTrackerService";

interface LogEntry {
  id: number;
  log_date: string;
  smoked: boolean;
  cigarettes_count: number | null;
  cravings_level: number | null;
  mood: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogsModal({ open, onOpenChange }: LogsModalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Load logs when modal opens
  useEffect(() => {
    if (open) {
      loadLogs();
    }
  }, [open, currentPage]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await quitTrackerService.getAllLogs({
        page: currentPage,
        limit: 50
      });

      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMoodEmoji = (mood: number | null) => {
    if (!mood) return '😐';
    if (mood <= 3) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const getCravingsEmoji = (cravings: number | null) => {
    if (!cravings) return '🚭';
    if (cravings <= 3) return '💪';
    if (cravings <= 6) return '😤';
    if (cravings <= 8) return '🔥';
    return '🌋';
  };

  const goToPreviousPage = () => {
    if (pagination.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl !bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold" style={{ color: "#1C3B5E" }}>
            Your Daily Logs
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadLogs} variant="outline">
                Try Again
              </Button>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: "#20B2AA" }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#1C3B5E" }}>
                No logs yet
              </h3>
              <p className="text-sm" style={{ color: "#666666" }}>
                Start logging your daily progress to see your journey here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl border transition-all hover:shadow-md"
                  style={{
                    borderColor: log.smoked ? "#ef4444" : "#20B2AA",
                    backgroundColor: log.smoked ? "#ef444410" : "#20B2AA10"
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${log.smoked ? "bg-red-100" : "bg-green-100"
                          }`}
                      >
                        {log.smoked ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "#1C3B5E" }}>
                          {formatDate(log.log_date)}
                        </p>
                        <p className="text-xs" style={{ color: "#666666" }}>
                          Logged at {formatTime(log.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${log.smoked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        {log.smoked ? "Used Tobacco" : "Tobacco-Free"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {log.cigarettes_count !== null && (
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: "#1C3B5E" }}>
                          {log.cigarettes_count}
                        </p>
                        <p className="text-xs" style={{ color: "#666666" }}>
                          Units
                        </p>
                      </div>
                    )}
                    {log.cravings_level !== null && (
                      <div className="text-center">
                        <p className="text-2xl">{getCravingsEmoji(log.cravings_level)}</p>
                        <p className="text-xs" style={{ color: "#666666" }}>
                          Cravings ({log.cravings_level}/10)
                        </p>
                      </div>
                    )}
                    {log.mood !== null && (
                      <div className="text-center">
                        <p className="text-2xl">{getMoodEmoji(log.mood)}</p>
                        <p className="text-xs" style={{ color: "#666666" }}>
                          Mood ({log.mood}/10)
                        </p>
                      </div>
                    )}
                  </div>

                  {log.notes && (
                    <div className="p-3 rounded-xl bg-gray-50">
                      <p className="text-sm" style={{ color: "#333333" }}>
                        <span className="font-medium">Notes:</span> {log.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={!pagination.hasPrev}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm" style={{ color: "#666666" }}>
              Page {pagination.page} of {pagination.totalPages} • {pagination.total} total logs
            </div>

            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={!pagination.hasNext}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
