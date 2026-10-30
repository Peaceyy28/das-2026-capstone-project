/**
 * A Node represents one person standing in line.
 */
class QueueNode {
  constructor(value) {
    this.value = value; // The person's details
    this.next = null;   // The next person behind them (starts as empty)
  }
}
/**
 * The line (FIFO Queue).
 */
export class WaitlistQueue {
  constructor() {
    this.head = null;   // Front of the line
    this.tail = null;   // End of the line
    this._size = 0;     // Total count
  }

  /**
   * Add a person to the end of the line.
   * Time: O(1)
   */
  enqueue(item) {
    const newNode = new QueueNode(item);

    if (!this.tail) {
      // The line was empty: this person is both front and back
      this.head = newNode;
      this.tail = newNode;
    } else {
      // Connect them to the back of the current tail
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this._size++;
  }
    /**
   * Remove and return the person at the front of the line.
   * Time: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const removedValue = this.head.value;
    // The next person in line becomes the new head
    this.head = this.head.next;
    this._size--;

    // If the line is now empty, reset tail to null
    if (this._size === 0) {
      this.tail = null;
    }

    return removedValue;
  }

  /**
   * Peek at who is next in line without removing them.
   */
  peek() {
    return this.head ? this.head.value : null;
  }

  /**
   * Is the line empty?
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * How many people are waiting?
   */
  get size() {
    return this._size;
  }

  /**
   * Helper to print everyone in line as an array.
   */
  toArray() {
    const list = [];
    let current = this.head;
    while (current) {
      list.push(current.value);
      current = current.next;
    }
    return list;
  }
}
