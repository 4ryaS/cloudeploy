import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

const storage = new Storage();

async function Handler(req: NextRequest) {

    try {
        const { id } = await req.json();
        const [files] = await storage.bucket("cloudeploy").getFiles({ prefix: `output/${id}/` })

        if (files.length > 0) {
            return NextResponse.json({
                message: "deployed"
            });
        }
        return NextResponse.json({
            message: "deploying"
        })
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }

}

export { Handler as POST };