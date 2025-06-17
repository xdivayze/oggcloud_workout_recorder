import { http, HttpResponse } from "msw";

export default function handleFetchExerciseNames(){ 
    return http.get("/api/protected/fetch-exercise-names", ({request})=>{
        const params = new URL(request.url).searchParams;
        const startsWith = params.get("starts_with") || "";
        console.log(startsWith)
         const exerciseNames = 
            {"Bench Press": 50,
            "Squat": 100,
            "Deadlift": 25,}
            
        return HttpResponse.json({exerciseNames: exerciseNames}, {status: 200})
    })
}