import dayjs from "dayjs";
import {  type Dispatch, type SetStateAction } from "react";
import { REQUEST_FIELDNAMES } from "../../../../Tools/constants";


//this function fetches the workout plot, a single png image, for a given exercise
//it won't work if multiple images are returned
export async function FetchWorkoutPlots(
  startDate: Date,
  endDate: Date,
  exercise: string,
  setFetching: Dispatch<SetStateAction<boolean>>,
  setImageSrcs: Dispatch<SetStateAction<Array<string> | null>>,
    authCode: string,
    id: string,
) {
  endDate.setHours(23, 59, 59, 999); // Set end date to the end of the day
  startDate.setHours(0, 0, 0, 0); // Set start date to the beginning of the day

  const layout = "YYYY-MM-DD HH:mm:ss"

  const startDateFormatted = dayjs(startDate).format(layout);
  const endDateFormatted = dayjs(endDate).format(layout);

  const params = new URLSearchParams({
    exercise_name: exercise,
    start_time: startDateFormatted,
    end_time: endDateFormatted,
  });

  const url = `/api/protected/get-progress?${params.toString()}`;
  

  setFetching(true);
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      [REQUEST_FIELDNAMES.ID]: id,
      [REQUEST_FIELDNAMES.AUTH_CODE]: authCode,
    },
  })
    .catch((error) => {
      throw error;
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.body;
    })
    .finally(() => {
      setFetching(false);
    });
  if (!resp) {
    throw new Error("Response body is null");
  }

  const reader = resp.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob(chunks, { type: "image/png" });
  const imageUrl = URL.createObjectURL(blob);
  setFetching(false);
  setImageSrcs((prev) => { //TODO handle multiple images
    if (prev === null) return [imageUrl];
    return [...prev, imageUrl];
  });
}
