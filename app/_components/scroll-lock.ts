let locks = 0;
let previousOverflow = "";

export function acquireScrollLock() {
  if (locks === 0) previousOverflow = document.body.style.overflow;
  locks += 1;
  document.body.style.overflow = "hidden";
}

export function releaseScrollLock() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.body.style.overflow = previousOverflow;
}
