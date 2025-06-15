export function fetchExerciseList(startsWith: string) {
    const resp = fetch(`/api/protected/fetch-exercise-names?starts_with=${encodeURIComponent(startsWith)}}`)
        .then(async (response) => {
            if (!response.ok || response.status !== 404) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const bodyJson = await response.json();
            const exerciseNames = bodyJson.exercise_names as string[];
            return exerciseNames;
        })
    return resp
}