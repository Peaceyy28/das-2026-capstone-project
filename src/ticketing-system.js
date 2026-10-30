import { WaitlistQueue } from './waitlist-queue.js';

/**
 * Helper to generate a random 6-character booking reference (e.g., BK-9XF2A1).
 */
function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'BK-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export class TicketingSystem {
  constructor() {
    this.events = new Map();        // Stores events: eventId -> Event
    this.bookingsByRef = new Map(); // Fast O(1) registry: reference -> Booking
  }  /**
   * DOMAIN RULE: Organizers can create an event.
   */
  createEvent({ id, title, city, venue, date }) {
    if (!id || !title || !city || !venue || !date) {
      throw new Error('All event fields (id, title, city, venue, date) are required.');
    }
    if (this.events.has(id)) {
      throw new Error(`Event with id "${id}" already exists.`);
    }

    const event = {
      id,
      title,
      city,
      venue,
      date: new Date(date),
      tiers: new Map() // Holds ticket tiers for this specific event
    };

    this.events.set(id, event);
    return event;
  }   /**
   * DOMAIN RULE: Organizers add ticket tiers with capacity and integer pricing.
   */
  addTier(eventId, { id, name, priceInCents, capacity }) {
    const event = this.events.get(eventId);
    if (!event) {
      throw new Error(`Event with id "${eventId}" not found.`);
    }
    if (event.tiers.has(id)) {
      throw new Error(`Tier with id "${id}" already exists.`);
    }
    if (!Number.isInteger(priceInCents) || priceInCents < 0) {
      throw new Error('Price must be a non-negative integer (in smallest currency unit).');
    }
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('Capacity must be a positive integer.');
    }

    const tier = {
      id,
      name,
      priceInCents,
      capacity,
      bookedCount: 0,
      waitlist: new WaitlistQueue(), // Its own FIFO waitlist!
      get availableSeats() {
        return this.capacity - this.bookedCount;
      }
    };

    event.tiers.set(id, tier);
    return tier;
  }   /**
   * DOMAIN RULE: Attendees book tickets.
   * Enforces capacity constraints and validates quantity.
   */
  bookTickets({ eventId, tierId, attendeeName, attendeeEmail, quantity }) {
    const event = this.events.get(eventId);
    if (!event) return { success: false, reason: 'EVENT_NOT_FOUND' };

    const tier = event.tiers.get(tierId);
    if (!tier) return { success: false, reason: 'TIER_NOT_FOUND' };

    // Validation: Quantity must be an integer between 1 and 10
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 10) {
      return { 
        success: false, 
        reason: 'VALIDATION_ERROR', 
        message: 'Quantity must be an integer between 1 and 10.' 
      };
    }

    // THE CAPACITY RULE: Are there enough seats left?
    if (tier.availableSeats < quantity) {
      return {
        success: false,
        reason: 'SOLD_OUT',
        message: `Only ${tier.availableSeats} seat(s) available for tier "${tier.name}".`,
        availableSeats: tier.availableSeats
      };
    }

    // Allocate the seats
    tier.bookedCount += quantity;

    // Generate unique reference code
    let reference;
    do {
      reference = generateReference();
    } while (this.bookingsByRef.has(reference));

    const booking = {
      reference,
      eventId,
      tierId,
      attendeeName,
      attendeeEmail,
      quantity,
      pricePerTicketInCents: tier.priceInCents,
      totalPriceInCents: tier.priceInCents * quantity,
      status: 'CONFIRMED',
      createdAt: new Date()
    };

    // Store in our O(1) lookup Map
    this.bookingsByRef.set(reference, booking);

    return { success: true, booking };
  }  /**
   * DOMAIN RULE: If sold out, attendees join the FIFO waitlist.
   */
  joinWaitlist({ eventId, tierId, attendeeName, attendeeEmail, quantity = 1 }) {
    const event = this.events.get(eventId);
    if (!event) throw new Error('Event not found.');

    const tier = event.tiers.get(tierId);
    if (!tier) throw new Error('Tier not found.');

    const entry = { attendeeName, attendeeEmail, quantity, joinedAt: new Date() };
    
    // Add to our linked list queue!
    tier.waitlist.enqueue(entry);

    return {
      success: true,
      position: tier.waitlist.size,
      entry
    };
  }

  /**
   * DOMAIN RULE: Cancelling a booking releases seats & alerts the next person in line.
   */
  cancelBooking(reference) {
    const booking = this.bookingsByRef.get(reference);
    if (!booking) return { success: false, reason: 'BOOKING_NOT_FOUND' };
    if (booking.status === 'CANCELLED') return { success: false, reason: 'ALREADY_CANCELLED' };

    booking.status = 'CANCELLED';

    const event = this.events.get(booking.eventId);
    const tier = event.tiers.get(booking.tierId);

    // Release capacity
    tier.bookedCount -= booking.quantity;

    // Check if anyone is waiting on the FIFO waitlist
    let nextInLine = null;
    if (!tier.waitlist.isEmpty()) {
      nextInLine = tier.waitlist.dequeue(); // Pulls the person waiting longest!
    }

    return {
      success: true,
      booking,
      releasedSeats: booking.quantity,
      nextInLine
    };
  }

  /**
   * DOMAIN RULE: Fast O(1) lookup of a booking by reference code.
   */
  getBooking(reference) {
    return this.bookingsByRef.get(reference) || null;
  }
}