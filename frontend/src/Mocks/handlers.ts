import {http, HttpResponse} from "msw"

export const handlers = [
    http.get("/api/user/login", () => {
        return HttpResponse.json({
            authCode : "welcome_to_ogglabs"
        })
    })
]