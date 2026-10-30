import { TicketingSystem } from './ticketing-system.js';

function divider() {
  console.log('='.repeat(70));
}

function runDemo() {
  divider();
  console.log('🎟️   EVENT TICKETING SYSTEM — BUILD 1 DEMO');
  console.log('     Demonstrating capacity rules, waitlist queue & fast lookups');
  divider();

  const system = new TicketingSystem();

  // 1. Organizer creates an event and adds ticket tiers
  console.log('\n[STEP 1] Organizer creates event & sets tier capacity');
  const event = system.createEvent({
    id: 'evt-2026-afrotech',
    title: 'AfroTech Summit 2026',
    city: 'Lagos',
    venue: 'Eko Convention Centre',
    date: '2026-11-20'
  });

  const vipTier = system.addTier(event.id, {
    id: 'tier-vip',
    name: 'VIP Pass',
    priceInCents: 5000000, // 50,000 NGN / Cents integer
    capacity: 3
  });

  console.log(`✓ Event created: "${event.title}" in ${event.city}`);
  console.log(`✓ Tier added: "${vipTier.name}" with capacity = ${vipTier.capacity} seats`);

  // 2. Attendees start booking
  console.log('\n[STEP 2] Attendees book tickets until tier is sold out');
  
  const booking1 = system.bookTickets({
    eventId: event.id,
    tierId: vipTier.id,
    attendeeName: 'Alice Johnson',
    attendeeEmail: 'alice@example.com',
    quantity: 1
  });
  console.log(`✓ Alice booked 1 seat. Reference: [${booking1.booking.reference}]. Seats remaining: ${vipTier.availableSeats}`);

  const booking2 = system.bookTickets({
    eventId: event.id,
    tierId: vipTier.id,
    attendeeName: 'Bob Williams',
    attendeeEmail: 'bob@example.com',
    quantity: 2
  });
  console.log(`✓ Bob booked 2 seats. Reference: [${booking2.booking.reference}]. Seats remaining: ${vipTier.availableSeats}`);
  console.log(`⚠️  Status: "${vipTier.name}" is now completely SOLD OUT (${vipTier.bookedCount}/${vipTier.capacity} seats taken).`);

  // 3. Charlie tries to book, but is refused
  console.log('\n[STEP 3] Charlie tries to book a ticket for the sold-out tier');
  const failedBooking = system.bookTickets({
    eventId: event.id,
    tierId: vipTier.id,
    attendeeName: 'Charlie Brown',
    attendeeEmail: 'charlie@example.com',
    quantity: 1
  });
  console.log(`❌ Booking refused! Reason: ${failedBooking.reason}`);
  console.log(`   Message: ${failedBooking.message}`);

  // 4. Attendees join the FIFO waitlist
  console.log('\n[STEP 4] Attendees join the FIFO Waitlist');
  const waitlist1 = system.joinWaitlist({
    eventId: event.id,
    tierId: vipTier.id,
    attendeeName: 'Charlie Brown',
    attendeeEmail: 'charlie@example.com',
    quantity: 1
  });
  console.log(`✓ Charlie joined the waitlist at position #${waitlist1.position}`);

  const waitlist2 = system.joinWaitlist({
    eventId: event.id,
    tierId: vipTier.id,
    attendeeName: 'Dave Miller',
    attendeeEmail: 'dave@example.com',
    quantity: 1
  });
  console.log(`✓ Dave joined the waitlist at position #${waitlist2.position}`);
  console.log(`Current waitlist queue: [${vipTier.waitlist.toArray().map(w => w.attendeeName).join(' -> ')}]`);

  // 5. Bob cancels his booking
  console.log('\n[STEP 5] Bob cancels his booking');
  const cancelResult = system.cancelBooking(booking2.booking.reference);
  console.log(`✓ Booking [${booking2.booking.reference}] cancelled.`);
  console.log(`✓ Seats released: ${cancelResult.releasedSeats}. Total seats now available: ${vipTier.availableSeats}`);

  // 6. The next person in line is named
  console.log('\n[STEP 6] System checks FIFO Waitlist for next attendee in line');
  if (cancelResult.nextInLine) {
    console.log(`🎉 Next in line offered freed seat:`);
    console.log(`   Name:     ${cancelResult.nextInLine.attendeeName}`);
    console.log(`   Email:    ${cancelResult.nextInLine.attendeeEmail}`);
    console.log(`   Quantity: ${cancelResult.nextInLine.quantity}`);
    console.log(`   Remaining on waitlist: ${vipTier.waitlist.size} (Dave is next)`);
  }

  // 7. Fast lookup of booking by reference code
  console.log('\n[STEP 7] Fast O(1) Booking Lookup via Map');
  const lookupRef = booking1.booking.reference;
  const retrieved = system.getBooking(lookupRef);
  console.log(`✓ Lookup for reference "${lookupRef}":`);
  console.log(`   Attendee: ${retrieved.attendeeName} (${retrieved.attendeeEmail})`);
  console.log(`   Status:   ${retrieved.status}`);
  console.log(`   Total:    ${retrieved.totalPriceInCents} cents`);

  divider();
  console.log('✅ Demo complete: The whole lifecycle executed successfully!');
  divider();
}

runDemo();