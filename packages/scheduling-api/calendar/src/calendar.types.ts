export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEventInput {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
}

export type CalendarEventUpdate = Partial<CalendarEventInput>;
