import { NextResponse } from "next/server";

// This is a simple API route to provide information about the Socket.io server
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Socket.io server information",
    serverUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001",
    documentation: "Connect to this server using the Socket.io client library",
  });
}
