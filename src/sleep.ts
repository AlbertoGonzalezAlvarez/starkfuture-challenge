export const sleep = (delayInMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayInMs));
