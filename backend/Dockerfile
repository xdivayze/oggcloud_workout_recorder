FROM golang:1.24.4-alpine as builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o server ./main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
COPY --from=builder /app/.env .env
EXPOSE 8080
CMD ["./server"]