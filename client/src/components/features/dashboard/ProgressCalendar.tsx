import { useState, useEffect } from 'react';
import { Card } from "../../ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import quitTrackerService from "../../../services/quitTrackerService";

interface DailyLog {
  id: string;
  log_date: string;
  smoked: boolean;
  cigarettes_count?: number;
  cravings_level?: number;
  mood?: number;
  notes?: string;
}

export function ProgressCalendar() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch daily logs data
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await quitTrackerService.getLogs();
        setLogs(response.logs || []);
      } catch (error) {
        // Error fetching logs
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Determine color based on log data
  const getLogColor = (log: DailyLog) => {
    if (log.smoked) {
      return '#ff0800ff'; // Red for smoked days
    } else {
      // Non-smoke days - check cravings and mood
      const cravings = log.cravings_level || 5; // Default to medium if not set
      const mood = log.mood || 5; // Default to medium if not set
      
      // High cravings (7-10) OR bad mood (1-3) = teal color
      if (cravings >= 7 || mood <= 3) {
        return '#20B2AA'; // Teal for non-smoke days with high cravings/bad mood
      } else {
        return '#48ff00ff'; // Green for non-smoke days with low cravings/good mood
      }
    }
  };

  // Create events for calendar based on logs
  const calendarEvents = logs.map(log => {
    const color = getLogColor(log);
    return {
      start: log.log_date,
      allDay: true,
      display: 'background',
      backgroundColor: color,
    };
  });

  // Remove date click handler to disable modal popup
  // const handleDateClick = (arg: any) => {
  //   // Removed to prevent modal popup
  // };

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100 w-full bg-white">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Progress Calendar</h3>
        </div>

        <div className="relative bg-white rounded-lg border border-gray-200">
          <style jsx>{`
            .fc {
              font-family: system-ui, -apple-system, sans-serif !important;
              font-size: 0.875rem !important;
            }
            .fc-theme-standard .fc-scrollgrid {
              border: 1px solid #e5e7eb !important;
              border-radius: 6px !important;
              overflow: hidden !important;
            }
            .fc-theme-standard td, .fc-theme-standard th {
              border: 1px solid #f3f4f6 !important;
              padding: 0 !important;
            }
            .fc-theme-standard .fc-scrollgrid td:last-child,
            .fc-theme-standard .fc-scrollgrid th:last-child {
              border-right: 1px solid #e5e7eb !important;
            }
            .fc-theme-standard .fc-scrollgrid tr:last-child td {
              border-bottom: 1px solid #e5e7eb !important;
            }
            .fc-col-header {
              background: #fafbfc !important;
            }
            .fc-col-header-cell {
              padding: 6px 2px !important;
              font-weight: 600 !important;
              font-size: 0.7rem !important;
              color: #6b7280 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              text-align: center !important;
            }
            .fc-daygrid-day-number {
              color: #374151 !important;
              font-weight: 500 !important;
              font-size: 0.8rem !important;
              padding: 4px 2px !important;
              text-align: center !important;
              width: 100% !important;
              line-height: 1.2 !important;
            }
            .fc-daygrid-day {
              background: white !important;
              min-height: 32px !important;
              position: relative !important;
              padding: 0 !important;
            }
            .fc-daygrid-day:hover {
              background: #f8fafc !important;
            }
            .fc-day-today {
              background: #fef3c7 !important;
            }
            .fc-day-today .fc-daygrid-day-number {
              font-weight: 600 !important;
              color: #d97706 !important;
            }
            .fc-daygrid-day-bg {
              opacity: 0.9 !important;
            }
            .fc-event-bg {
              opacity: 0.9 !important;
            }
            .fc-daygrid-day .fc-bg-event {
              opacity: 0.9 !important;
              border: none !important;
              border-radius: 0 !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
            }
            .fc-toolbar {
              margin-bottom: 0 !important;
              padding: 8px !important;
            }
            .fc-toolbar-title {
              font-size: 0.95rem !important;
              font-weight: 600 !important;
              color: #111827 !important;
              margin: 0 8px !important;
            }
            .fc-toolbar-chunk {
              display: flex !important;
              align-items: center !important;
            }
            .fc-button-primary {
              background: white !important;
              border: 1px solid #d1d5db !important;
              color: #6b7280 !important;
              font-weight: 500 !important;
              padding: 4px 6px !important;
              border-radius: 4px !important;
              min-width: 24px !important;
              height: 24px !important;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
            }
            .fc-button-primary:hover {
              background: #f9fafb !important;
              border-color: #9ca3af !important;
              color: #374151 !important;
            }
            .fc-button-primary:disabled {
              opacity: 0.5 !important;
              cursor: not-allowed !important;
            }
            .fc-button-primary .fc-icon {
              font-size: 12px !important;
              margin: 0 !important;
            }
            .fc-daygrid-event {
              margin: 0 !important;
              padding: 0 !important;
            }
            .fc-daygrid-block-event {
              border: none !important;
              padding: 0 !important;
            }
            .fc-daygrid-day-frame {
              min-height: 32px !important;
              padding: 0 !important;
            }
            .fc-scrollgrid {
              font-size: 0.875rem !important;
            }
          `}</style>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'title',
              center: '',
              end: 'prev,next'
            }}
            dayHeaderFormat={{ weekday: 'short' }}
            height="auto"
            aspectRatio={1.5}
            events={calendarEvents}
          />
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#8BC34A' }}></div>
            <span className="text-xs text-gray-600">Good Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#20B2AA' }}></div>
            <span className="text-xs text-gray-600">High Cravings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#D9534F' }}></div>
            <span className="text-xs text-gray-600">Smoked</span>
          </div>
        </div>
      </div>
    </Card>
  );
}