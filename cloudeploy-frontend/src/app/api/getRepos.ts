import { NextRequest, NextResponse } from "next/server";
import simpleGit from "simple-git";
export const getRepos = async (req: NextRequest) => {
    const git = simpleGit();
    try {
        const { githubID } = await req.json();
        if(!githubID) {
            NextResponse.json({
                response: "githubID missing",
                status: 300
            })
        }



    } catch (error) {
        console.log(error);
    }
}