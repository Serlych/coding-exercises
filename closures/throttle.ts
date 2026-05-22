/*
 * Throttling is a technique that controls how often a function executes within a fixed time interval.
 * It improves performance by ensuring functions run at a consistent rate during frequent events.
 *
 * Limits function execution to once per specified time frame.
 * Prevents performance issues during heavy events like scrolling.
 * Ensures smoother and more efficient event handling
*/

function spammyFn(thingToSpam: number) {
  console.log(thingToSpam);
}

function throttle(cb, delay: number) {
  let lastExecuteMs = 0;

  return (...args) => {
    const currExecuteMs = Date.now();

    if (currExecuteMs - lastExecuteMs >= delay) {
      cb(...args);
      lastExecuteMs = currExecuteMs;
    }
  };
}

const throttledSpammyFn = throttle(spammyFn, 2000);

setInterval(() => {
  throttledSpammyFn(67);
}, 100)



