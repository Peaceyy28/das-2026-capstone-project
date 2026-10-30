import { performance } from 'node:perf_hooks';

function generateRandomRef(index) {
  return `REF-${index.toString().padStart(7, '0')}`;
}

function runBenchmark() {
  console.log('='.repeat(70));
  console.log('⚡  BENCHMARK: Map Lookup O(1) vs Array.find O(n)');
  console.log('='.repeat(70));

  const RECORD_COUNT = 50000;
  const QUERY_COUNT = 2000;

  console.log(`\n1. Generating ${RECORD_COUNT.toLocaleString()} mock booking records...`);

  const arrayBookings = [];
  const mapBookings = new Map();

  for (let i = 0; i < RECORD_COUNT; i++) {
    const ref = generateRandomRef(i);
    const booking = {
      reference: ref,
      attendeeName: `Attendee #${i}`,
      quantity: 1,
      totalCents: 5000
    };
    arrayBookings.push(booking);
    mapBookings.set(ref, booking);
  }

  // Pick 2,000 random references to search for
  const targetRefs = [];
  for (let i = 0; i < QUERY_COUNT; i++) {
    const randomIndex = Math.floor(Math.random() * RECORD_COUNT);
    targetRefs.push(generateRandomRef(randomIndex));
  }

  console.log(`2. Performing ${QUERY_COUNT.toLocaleString()} lookups on both data structures...\n`);

  // --- 1. Benchmark Array.find ---
  const startArray = performance.now();
  let arrayHits = 0;
  for (let i = 0; i < QUERY_COUNT; i++) {
    const query = targetRefs[i];
    const found = arrayBookings.find(b => b.reference === query);
    if (found) arrayHits++;
  }
  const endArray = performance.now();
  const arrayTimeMs = endArray - startArray;

  // --- 2. Benchmark Map.get ---
  const startMap = performance.now();
  let mapHits = 0;
  for (let i = 0; i < QUERY_COUNT; i++) {
    const query = targetRefs[i];
    const found = mapBookings.get(query);
    if (found) mapHits++;
  }
  const endMap = performance.now();
  const mapTimeMs = endMap - startMap;

  const speedup = (arrayTimeMs / mapTimeMs).toFixed(1);

  // --- Results Table ---
  console.log('┌──────────────────┬─────────────────┬───────────────────┐');
  console.log('│ Data Structure   │ Time Taken (ms) │ Operations / sec  │');
  console.log('├──────────────────┼─────────────────┼───────────────────┤');
  console.log(`│ Array.find O(n)  │ ${arrayTimeMs.toFixed(2).padStart(15)} │ ${Math.round((QUERY_COUNT / arrayTimeMs) * 1000).toLocaleString().padStart(17)} │`);
  console.log(`│ Map.get    O(1)  │ ${mapTimeMs.toFixed(2).padStart(15)} │ ${Math.round((QUERY_COUNT / mapTimeMs) * 1000).toLocaleString().padStart(17)} │`);
  console.log('└──────────────────┴─────────────────┴───────────────────┘');

  console.log(`\n🚀 Result: Map lookup is ${speedup}x FASTER than Array.find!\n`);

  console.log('='.repeat(70));
  console.log('📖 BIG-O THEORETICAL EXPLANATION:');
  console.log('='.repeat(70));
  console.log(`
1. Array.find — Linear Time: O(n)
   - JavaScript scans elements one by one from index 0 to n.
   - For k lookups across n records: Total Time = O(k * n).
   - As your system grows from 50,000 to 500,000, searches become 10x slower.

2. Map.get — Constant Time: O(1)
   - Uses a Hash Table internally to jump directly to the memory address.
   - For k lookups across n records: Total Time = O(k).
   - Whether the system has 50 records or 5,000,000 records, lookup speed stays virtually instantaneous.
`);
  console.log('='.repeat(70));
}

runBenchmark();