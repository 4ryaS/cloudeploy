import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
    try {
        const { repoUrl } = await req.json();
        const response = await fetch("http://cloudeploy.0xdevs.xyz/deploy", {
            method: "POST",
            body: JSON.stringify({
                repoUrl: repoUrl
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" });
    }
}


export {handler as POST};