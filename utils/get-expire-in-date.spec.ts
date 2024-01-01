import { describe, expect, it } from "vitest";

import { getExpireInDate } from "./get-expire-in-date";

describe("GetExpireIn", () => {
  it("should return current date + seconds if the date is in the past", () => {
    const SEVEN_DAYS_IN_SECONDS = 604800;
    const getExpireInDateReturn = getExpireInDate(SEVEN_DAYS_IN_SECONDS);

    const date = new Date();
    date.setSeconds(date.getSeconds() + SEVEN_DAYS_IN_SECONDS);

    expect(getExpireInDateReturn).toBe(date.toISOString());
  });
});
