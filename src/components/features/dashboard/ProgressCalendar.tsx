import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card } from "../../ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// Remove the dynamic import of Calendar since we're using FullCalendar directly

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const generateTimeSlots = (startTime: string, endTime: string) => {
  const timeSlots = [];
  const start = new Date(`2024-01-01T${startTime}:00`);
  const end = new Date(`2024-01-01T${endTime}:00`);

  while (start <= end) {
    timeSlots.push(start.toTimeString().slice(0, 5));
    start.setMinutes(start.getMinutes() + 30);
  }

  return timeSlots;
};

const formatTo12Hour = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

export function ProgressCalendar() {
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [appointmentsdateTimePairs, setAppointmentsdateTimePairs] = useState<string[]>([]);
  const [is24Hour, setIs24Hour] = useState(false);
  const timeSlotDivRef = useRef<HTMLDivElement>(null);
  const [enabledDays, setEnabledDays] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Record<string, { start: string; end: string }>>({});

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (timeSlotDivRef.current && !timeSlotDivRef.current.contains(event.target as Node)) {
      setIsTimeVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateClick = (arg: any) => {
    const date = arg.dateStr;
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    setSelectedDate(date);
    setSelectedDay(day);
    setIsTimeVisible(true);

    // Mock time slots for demonstration
    const timeRange = { start: '09:00', end: '17:00' }; // Default time range
    const slots = generateTimeSlots(timeRange.start, timeRange.end);
    setAvailableTimeSlots(slots);
    setAppointmentsdateTimePairs([]); // Clear any previous appointments
  };

  const handleTimeClick = (time: string) => {
    setSelectedTimeSlot(time);
    // Here you would typically handle the time slot selection
    console.log(`Selected time: ${time} on ${selectedDate}`);
    setIsTimeVisible(false);
  };

  // Mock data for marked dates
  const markedDates = {
    '2025-10-01': 'smoke-free',
    '2025-10-02': 'smoke-free',
    '2025-10-03': 'high',
    '2025-10-04': 'smoke-free',
    '2025-10-05': 'smoke-free',
    '2025-10-06': 'smoke-free',
    '2025-10-07': 'smoke-free',
    '2025-10-08': 'smoke-free',
    '2025-10-09': 'smoke-free',
    '2025-10-10': 'smoke-free',
    '2025-10-13': 'high',
    '2025-10-14': 'smoke-free',
    '2025-10-15': 'smoke-free',
    '2025-10-16': 'smoke-free',
  };

  const eventContent = (arg: any) => {
  // Check if arg.date exists and is a valid date
  if (!arg.date) {
    return null; // or return a default content
  }
  
  try {
    const dateStr = new Date(arg.date).toISOString().split('T')[0];
    const status = markedDates[dateStr as keyof typeof markedDates];

    if (status === 'smoke-free') {
      return {
        className: 'bg-[#20B2AA]',
        // ... rest of your smoke-free styling
      };
    }
    // ... rest of your existing code
  } catch (error) {
    console.error('Error processing date:', error);
    return null;
  }
};

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100 w-full">
      <div className="p-4 " >
        <div className="flex justify-between items-center mb-3 ">
          <h3 className="text-base font-bold text-gray-900">Progress Calendar</h3>
          {/* <button
            onClick={() => {
              const calendarApi = document.querySelector('.fc') as any;
              if (calendarApi) {
                calendarApi.getApi().today();
              }
            }}
            className="text-xs text-[#20B2AA] hover:text-[#1a9c94] font-medium"
          >
            Today
          </button> */}
        </div>

        <div className="relative">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'title',
              center: '',
              end: 'prev,next'
            }}
            dayHeaderFormat={{ weekday: 'short' }}
            dayHeaderContent={(arg) => ({
              html: `<div class="bg-[#e3f4ffd7] text-black p-2">${arg.text}</div>`
            })}
            dayCellContent={(arg) => ({
              html: `<div class="hover:bg-[#5fb6afd7] cursor-pointer h-full w-full">${arg.dayNumberText}</div>`
            })}
            height="auto"
            dateClick={handleDateClick}
            eventContent={eventContent}
            events={Object.entries(markedDates).map(([date, status]) => ({
              start: date,
              display: 'background',
              className: status === 'smoke-free' ? 'bg-[#20B2AA]' : 'bg-[#E57373]'
            }))}
          />

          {isTimeVisible && selectedDate && (
            <div
              ref={timeSlotDivRef}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[15vw] max-h-[50vh] px-6 py-8 border text-center rounded-lg shadow-lg bg-white z-10 overflow-y-auto`}
            >
              <div className='flex justify-between items-center'>
                <h1 className='mt-5 text-lg font-semibold mb-4'>
                  On <span className='text-green-700'>{selectedDate}</span> @
                </h1>
                <button
                  className='mb-6 px-2 py-1 border rounded-lg stroke-blue-500 text-gray-600 hover:bg-gray-200 transition duration-200 text-sm'
                  onClick={toggleTimeFormat}
                >
                  {is24Hour ? '24HR' : '12HR'}
                </button>
              </div>

              {availableTimeSlots.map((slot) => (
                <div
                  key={slot}
                  className={`border border-gray-300 p-2 rounded-lg mb-4 transition-colors duration-200 
                    ${appointmentsdateTimePairs.includes(slot)
                      ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-300 cursor-pointer'}`}
                  onClick={() => !appointmentsdateTimePairs.includes(slot) && handleTimeClick(slot)}
                >
                  <span className="text-sm font-small">
                    {is24Hour ? slot : formatTo12Hour(slot)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#20B2AA]"></div>
              <span className="text-gray-600">Smoke-free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E57373]"></div>
              <span className="text-gray-600">High-risk</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}