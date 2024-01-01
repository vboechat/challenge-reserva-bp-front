/**
 * @description his function get the current date, increment the date by seconds received in parameter and return
 * the updated date in ISO format.
 *
 * @param seconds expiresIn time received by backend
 * @returns currentDate + seconds expiresIn
 */
export function getExpireInDate(seconds: number): string {
  const date = new Date();

  date.setSeconds(date.getSeconds() + seconds);

  return date.toISOString();
}
