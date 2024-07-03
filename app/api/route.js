import { NextResponse } from "next/server"
import OpenAI from "openai";

const openai = new OpenAI(
    { apiKey: process.env.OPEN_AI_KEY }
);

export const GET = async () => {

    const myAssistants = await openai.beta.assistants.list({
        order: "desc",
        limit: "20",
    });

    const data = myAssistants?.data || {};
    return NextResponse.json(data, { status: 200 })
}

export const POST = async (req) => {
    const { data } = await req.json();
    try {
        const createThread = await openai.beta.threads.create();
        const thread = createThread;
        const threadID = thread?.id

        const threadMessages = await openai.beta.threads.messages.create(
            threadID,
            { role: "user", content: data }
        );

        const run = await openai.beta.threads.runs.create(
            threadID,
            { assistant_id: "asst_hshWN0Qpb6w5DTxNlGGnDffk" }
        );

        try {
            const myPromise = new Promise((resolve, reject) => {
                const timer = setInterval(async () => {
                    const runStatus = await openai.beta.threads.runs.retrieve(
                        threadID,
                        run.id
                    );

                    if (runStatus.status === "completed") {
                        clearInterval(timer);
                        const message = await openai.beta.threads.messages.list(
                            threadID,
                            // threadMessages.id
                        );
                        resolve(message)
                    }
                }, 5000)

                setTimeout(() => {
                    clearInterval(timer)
                    reject('err')
                }, 35000);
            })

            const result = await myPromise;
            return NextResponse.json(result, { status: 200 });
        }
        catch (err) {
            return NextResponse.json({ err: 'error' }, { status: 400 });
        }
    }
    catch (err) {
        console.log(err)
        return NextResponse.json(err, { status: 500 });
    }

}