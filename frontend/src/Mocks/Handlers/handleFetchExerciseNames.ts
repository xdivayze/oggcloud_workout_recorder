import { http, HttpResponse } from "msw";

export default function handleFetchExerciseNames(){ 
    return http.get("/api/protected/fetch-exercise-names", ({request})=>{
        const params = new URL(request.url).searchParams;
        const startsWith = params.get("starts_with") || "";
        console.log(startsWith)
         const exerciseNames = [
            "Bench Press",
            "Squat",
            "Deadlift",
            ]
        return HttpResponse.json({exerciseNames: exerciseNames}, {status: 200})
    })
}