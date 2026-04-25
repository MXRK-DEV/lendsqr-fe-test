import { NextResponse } from "next/server";
import users from "@/data/users.json";

export async function GET() {
  return NextResponse.json(users);
}

// import { NextResponse } from "next/server";

// export async function GET() {
//   // JSON Generator API endpoint and token from environment variables
//   const templateUrl = process.env.NEXT_PUBLIC_DATA;
//   const token = process.env.JSON_GENERATOR_TOKEN;

//   if (!templateUrl || !token) {
//     return NextResponse.json(
//       { error: "Missing configuration" },
//       { status: 500 },
//     );
//   }

//   const res = await fetch(templateUrl, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     return NextResponse.json(
//       { error: "Failed to fetch from json-generator" },
//       { status: res.status },
//     );
//   }

//   const data = await res.json();
//   return NextResponse.json(data);
// }
