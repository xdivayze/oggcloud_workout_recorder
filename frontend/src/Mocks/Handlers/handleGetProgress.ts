import dayjs from "dayjs";
import { http, HttpResponse } from "msw";

export default function handleGetProgress() {
  return http.get("/api/protected/get-progress", async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const exerciseName = params.get("exercise_name");
    const startTime = params.get("start_time");
    const endTime = params.get("end_time");

    if (!exerciseName || !startTime || !endTime) {
      return HttpResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const startDateParsed = dayjs(startTime, "YYYY-MM-DD HH:mm:ss").toDate();
    const endDateParsed = dayjs(endTime, "YYYY-MM-DD HH:mm:ss").toDate();
    console.log(
      `Received request for exercise: ${exerciseName}, start: ${startDateParsed}, end: ${endDateParsed}`
    );
    if (startDateParsed > endDateParsed) {
      return HttpResponse.json(
        { error: "Start date cannot be after end date" },
        { status: 400 }
      );
    }

    const dummyImageUrl = "/mock-images/intraset_heatmap_test.png";
    const resp = await fetch(dummyImageUrl);
    const arrayBuffer = await resp.arrayBuffer();

    return HttpResponse.arrayBuffer(arrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
      status: 200,
    });
  });
}
