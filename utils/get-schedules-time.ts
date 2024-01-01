/**
 * @param formDate - Schedule date start in format YYYY-MM-DD
 * @param formFromTime - Schedule time start in format HH:MM
 * @param formDuration - Schedule duration in minutes
 */
export const getSchedulesTime = (
  formDate: string,
  formFromTime: string,
  formDuration: number
) => {
  const fromTime = `${formDate}T${formFromTime}`;
  const toTimeData = new Date(fromTime);
  toTimeData.setMinutes(toTimeData.getMinutes() + formDuration);
  toTimeData.setHours(toTimeData.getHours() - 3);

  // toTime should return "2023-12-31T16:30" WITHOUT SECONDS
  const toTimeDataMinutes = toTimeData.getMinutes().toString().padStart(2, "0");
  const toTime = `${
    toTimeData.toISOString().split(":")[0]
  }:${toTimeDataMinutes}`;

  const response = {
    fromTime,
    toTime,
  };

  return response;
};
