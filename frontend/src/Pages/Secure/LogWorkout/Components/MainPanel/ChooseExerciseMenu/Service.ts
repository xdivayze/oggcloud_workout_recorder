import { REQUEST_FIELDNAMES } from "../../../../../../Tools/constants";

export function fetchExerciseList(
  startsWith: string,
  authCode: string,
  id: string
) {
  startsWith = startsWith.trim();
  startsWith = encodeURIComponent(startsWith);
  if (startsWith === "") {
    startsWith = " "; // to avoid empty string, which is not a valid query param
  }
  const resp = fetch(
    `/api/protected/fetch-exercise-names?starts_with=${startsWith}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        [REQUEST_FIELDNAMES.AUTH_CODE]: authCode,
        [REQUEST_FIELDNAMES.ID]: id,
      },
    }
  ).then(async (response) => {
    if (!(response.ok || response.status === 404)) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const bodyJson = await response.json();
    const exerciseNames = bodyJson.exerciseNames as string[];
    if (!Array.isArray(exerciseNames)) {
      throw new Error("Invalid response format: exercise_names is not an array");
    }
    return exerciseNames;
  });
  return resp;
}
