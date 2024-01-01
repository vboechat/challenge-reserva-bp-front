import { describe, expect, it } from "vitest";

describe("GetSchedulesTime", () => {
  it("should return correct schedule times", () => {
    const formDate = "2023-12-31";
    const formFromTime = "16:00";
    const formDuration = 30;

    const time = getSchedulesTime(formDate, formFromTime, formDuration);

    expect(time).toStrictEqual({
      fromTime: "2023-12-31T16:00",
      toTime: "2023-12-31T16:30",
    });
  });

  it("should return correct schedule times when duration is 60 minutes", () => {
    const formDate = "2023-12-31";
    const formFromTime = "00:00";
    const formDuration = 60;

    const time = getSchedulesTime(formDate, formFromTime, formDuration);

    expect(time).toStrictEqual({
      fromTime: "2023-12-31T00:00",
      toTime: "2023-12-31T01:00",
    });
  });

  it("should return correct schedule times when duration is 120 minutes", () => {
    const formDate = "2023-12-31";
    const formFromTime = "00:00";
    const formDuration = 120;

    const time = getSchedulesTime(formDate, formFromTime, formDuration);

    expect(time).toStrictEqual({
      fromTime: "2023-12-31T00:00",
      toTime: "2023-12-31T02:00",
    });
  });
});
