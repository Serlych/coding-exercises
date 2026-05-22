// When you trigger a debounced function:
// 1. Timer Starts: A delay timer begins (e.g., 300ms)
// 2. Reset on Trigger: If the function is called again before the timer expires, the previous timer is canceled and a new one starts.
// 3. Execution: The actual code only runs once the timer finally reaches zero without being interrupted by another call.

function logHiWithName(name: string): void {
  console.log('hi ' + name);
}

function debounce(cb, delay: number) {
  let timeoutId: number;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      cb(args);
    }, delay);
  }
}

const debouncedLogWithName = debounce(logHiWithName, 2000);
debouncedLogWithName('joel');

// the returned function acceses 'timeoutId', this value lives inside the 'debouncedLogWithName' variable
// this is why the closure exists, otherwise the value couldn't reset on new triggers, the closure
// stores private state
