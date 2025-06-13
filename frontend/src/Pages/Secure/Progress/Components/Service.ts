import dayjs from "dayjs";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { REQUEST_FIELDNAMES } from "../../../../Tools/constants";
import { authContext } from "../../SecurityContext";

//this function fetches the workout plot, a single png image, for a given exercise
//it won't work if multiple images are returned
export async function FetchWorkoutPlots(
  startDate: Date,
  endDate: Date,
  exercise: string,
  setFetching: Dispatch<SetStateAction<boolean>>,
  setImageSrcs: Dispatch<SetStateAction<Array<string> | null>>
) {
  const startDateFormatted = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
  const endDateFormatted = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");

  const params = new URLSearchParams({
    exercise_name: exercise,
    start_time: startDateFormatted,
    end_time: endDateFormatted,
  });
  const authContextI = useContext(authContext);

  const authCode = authContextI?.authCode as string;
  const id = authContextI?.loginID as string;

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
  setImageSrcs((prev) => {
    if (prev === null) return [imageUrl];
    return [...prev, imageUrl];
  });
}
