const BOOKING_STATUS = new Set(['ACTIVE', 'CANCELLED', 'IN_PROGRESS', 'COMPLETE'])
const DEFAULT_BOOKING_DURATION = 50;

class InMemoryBookingsRepo {
  bookings = [
    {
      id: 'booking-1',
      propertyId: 'property-1',
      userId: 'user-1',
      agentId: 'agent-1',
      startDate: new Date('2026-06-15T09:00:00'),
      endDate: new Date('2026-06-15T09:50:00'),
      duration: 50,
      status: 'ACTIVE'
    },
    {
      id: 'booking-2',
      propertyId: 'property-1',
      userId: 'user-2',
      agentId: 'agent-1',
      startDate: new Date('2026-06-15T10:00:00'),
      endDate: new Date('2026-06-15T10:50:00'),
      duration: 50,
      status: 'ACTIVE'
    },
    {
      id: 'booking-3',
      propertyId: 'property-2',
      userId: 'user-3',
      agentId: 'agent-2',
      startDate: new Date('2026-06-16T14:00:00'),
      endDate: new Date('2026-06-15T10:50:00'),
      duration: 50,
      status: 'ACTIVE'
    }
  ];

  async addBooking(booking) {
    this.bookings.push(booking);

    return booking;
  }

  async findById(bookingId) {
    const result = this.bookings.find(b => b.id === bookingId);

    return result;
  }

  async findByUserId(userId, propertyId) {
    const result = this.bookings.filter(b => b.propertyId === propertyId && b.userId === userId);

    return result;
  }

  async findByTimeSlot(propertyId, date) {
    const result = this.bookings.find(
      b =>
        b.propertyId === propertyId &&
        b.startDate.getTime() === date.getTime()
    );

    return result;
  }

  async findByPropertyId(propertyId) {
    const result = this.bookings.filter(b => b.propertyId === propertyId);

    return result;
  }

  async editById(bookingId, newData) {
    const index = this.bookings.findIndex(
      b => b.id === bookingId
    );

    if (index < 0) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }

    this.bookings[index] = {
      ...this.bookings[index],
      ...newData
    };

    return this.bookings[index];
  }

  async getAllBookings() {
    return this.bookings;
  }
}

class InMemoryAgentsRepo {
  agents = [
    {
      id: 'agent-1',
      businessTimeStart: '09:00',
      businessTimeEnd: '17:00',
      businessDays: [1, 2, 3, 4, 5] // Mon-Fri
    },
    {
      id: 'agent-2',
      businessTimeStart: '10:00',
      businessTimeEnd: '18:00',
      businessDays: [1, 2, 3, 4, 5, 6] // Mon-Sat
    }
  ];

  async findById(agentId) {
    const result = this.agents.find(a => a.id === agentId);

    if (!result) {
      throw new Error(`Agent with id ${agentId} not found`);
    }

    return result;
  }
}

class InMemoryPropertiesRepo {
  properties = [
    {
      id: 'property-1',
      location: 'Downtown Apartment',
      agentId: 'agent-1'
    },
    {
      id: 'property-2',
      location: 'Beach House',
      agentId: 'agent-2'
    }
  ];

  async findById(propertyId) {
    const result = this.properties.find(
      p => p.id === propertyId
    );

    if (!result) {
      throw new Error(`Property with id ${propertyId} not found`);
    }

    return result;
  }
}

class TourService {
  bookingsRepo;
  propertiesRepo;
  agentsRepo;

  constructor({
    bookingsRepo,
    propertiesRepo,
    agentsRepo
  }) {
    this.bookingsRepo = bookingsRepo;
    this.propertiesRepo = propertiesRepo;
    this.agentsRepo = agentsRepo;
  }

  scheduledInThePast(date) {
    return date.getTime() < new Date().getTime();
  }

  async overlaps(date, propertyId) {
    function doesOverlap(startA, endA, startB, endB) {
      // console.log({
      //   startA,
      //   endA,
      //   startB,
      //   endB,
      //   startALTEndB: startA < endB,
      //   startBLTEndA: startB < endA
      // })
      return startA < endB && startB < endA;
    }

    const existingBookings = await this.bookingsRepo.findByPropertyId(propertyId);
    const validExistingBookings = existingBookings.filter(b => b.status === 'ACTIVE');
    for (const exBooking of validExistingBookings) {
      const endDate = new Date(date.getTime());
      endDate.setMinutes(DEFAULT_BOOKING_DURATION);

      const overlaps = doesOverlap(date, endDate, exBooking.startDate, exBooking.endDate);

      if (overlaps) {
        console.log(exBooking)
        return exBooking;
      }
    }

    return;
  }

  async userHasAlreadyScheduled(userId, propertyId) {
    const userBookings = await this.bookingsRepo.findByUserId(userId, propertyId);
    if (userBookings.length === 0) {
      return false;
    }

    const cancelledBookings = userBookings.filter(b => b.status === 'CANCELLED');
    if (cancelledBookings.length > 0) {
      return false;
    }

    return true;
  }

  async isWithinBusinessHours(propertyId, date) {
    const { agentId } = await this.propertiesRepo.findById(propertyId);
    const { businessTimeStart, businessTimeEnd, businessDays } = await this.agentsRepo.findById(agentId);

    const timeStartHrs = parseInt(businessTimeStart.split(':')[0]);
    const timeEndHrs = parseInt(businessTimeEnd.split(':')[0]);
    const dateHrs = date.getHours();

    if (dateHrs < timeStartHrs - 1) {
      return false;
    }

    if (dateHrs > timeEndHrs - 1) {
      return false;
    }

    const dayOfTheWeek = date.getDay();
    if (!(businessDays.includes(dayOfTheWeek))) {
      return false
    }

    return true;
  }

  async scheduleTour(userId, propertyId, startDate) {
    if (typeof (userId) !== 'string') {
      throw new Error('Only one user allowed or -userId- not of type string');
    }

    if (typeof (propertyId) !== 'string') {
      throw new Error('propertyId not of type string');
    }

    if (!(startDate instanceof Date)) {
      throw new Error('date not of type Date');
    }

    const minutes = new Date(startDate.setSeconds(0)).getMinutes();
    if (minutes > 0 && minutes <= 59) {
      throw new Error('Can only schedule tours with 0 minutes as input')
    }

    const userHasAlreadyScheduled = await this.userHasAlreadyScheduled(userId, propertyId);
    if (userHasAlreadyScheduled) {
      throw new Error('Only one booking per user');
    }

    const overlappingBooking = await this.overlaps(startDate, propertyId);
    if (overlappingBooking) {
      throw new Error(`There is already a booking: ${JSON.stringify(overlappingBooking, null, 2)}`);
    }

    const withinBusinessHours = await this.isWithinBusinessHours(propertyId, startDate);
    if (!withinBusinessHours) {
      throw new Error('Booking outside business hours');
    }

    const isScheduledInThePast = this.scheduledInThePast(startDate);
    if (isScheduledInThePast) {
      throw new Error('Unable to schedule meetings in the past');
    }

    const { agentId } = await this.propertiesRepo.findById(propertyId);
    const endDate = new Date(startDate.getTime())
    endDate.setMinutes(DEFAULT_BOOKING_DURATION);

    const newBooking = {
      id: crypto.randomUUID(),
      propertyId,
      userId,
      agentId,
      startDate,
      endDate,
      duration: DEFAULT_BOOKING_DURATION,
      status: 'ACTIVE'
    };

    await this.bookingsRepo.addBooking(newBooking)
    return newBooking;
  }

  async rescheduleTour(bookingId, newDate) {
    const bookingToReschedule = await this.bookingsRepo.findById(bookingId);
    if (!bookingToReschedule) {
      throw new Error('Cannot reschudule non-existant booking');
    }

    if (bookingToReschedule.status !== 'ACTIVE') {
      throw new Error(`Cannot reschedule a ${bookingToReschedule.status} booking`);
    }

    const { propertyId } = bookingToReschedule;

    const overlappingBooking = await this.overlaps(date, propertyId);
    if (overlappingBooking) {
      throw new Error(`There is already a booking: ${JSON.stringify(overlappingBooking, null, 2)}`);
    }

    const isScheduledInThePast = this.scheduledInThePast(date);
    if (isScheduledInThePast) {
      throw new Error('Unable to reschedule meetings in the past');
    }

    const withinBusinessHours = await this.isWithinBusinessHours(propertyId, newDate);
    if (!withinBusinessHours) {
      throw new Error('New booking date outside business hours');
    }

    await this.bookingsRepo.editById(bookingId, {
      date: newDate,
      rescheduled: true
    });
  }

  async cancelTour(bookingId) {
    const bookingToCancel = await this.bookingsRepo.findById(bookingId);

    if (!bookingToCancel) {
      throw new Error('Cannot cancel non-existant booking');
    }

    if (bookingToCancel.status !== 'ACTIVE') {
      throw new Error(`Cannot cancel ${bookingToCancel.status} booking`);
    }

    const outSideCancellingPeriod = Math.abs((new Date().getTime() - bookingToCancel.startDate.getTime()) / 3600000) < 24;
    if (outSideCancellingPeriod) {
      throw new Error('Cannot cancel outside cancelling period');
    }

    await this.bookingsRepo.editById(bookingId, {
      status: 'CANCELLED'
    })
  }
}

const bookingsRepo = new InMemoryBookingsRepo();
const agentsRepo = new InMemoryAgentsRepo();
const propertiesRepo = new InMemoryPropertiesRepo();

const tourService = new TourService({
  bookingsRepo,
  propertiesRepo,
  agentsRepo
});

const isaacUserId = crypto.randomUUID();
const d = new Date('2026-06-15T17:00:00')
const d2 = new Date('2026-06-15T17:00:00')

const booking = await tourService.scheduleTour(isaacUserId, 'property-1', d);
// await tourService.cancelTour(booking.id)
console.log(await bookingsRepo.getAllBookings())
// const booking2 = await tourService.scheduleTour(isaacUserId, 'property-1', d2);
// console.log(await bookingsRepo.getAllBookings())
// const newD = new Date('2026-06-15T12:00:00')
// await tourService.rescheduleTour(booking.id, newD);
// await tourService.cancelTour(booking.id)
