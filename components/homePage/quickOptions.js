import { callApi } from "@/hooks/callApi"
import { useRouter } from "next/navigation";

const GridBox = ({ onClick, text = "maroof" }) => {
    return (
        <div
            onClick={() => onClick(text)}
            className="bg-white truncate flex items-center justify-center text-[#ff7b73] rounded-full px-10 py-2 cursor-pointer transition-all duration-300 border border-[#ff7b73] hover:bg-transparent hover:text-white hover:border-white">
            {text}
        </div>
    )
}

export const QuickOptions = ({ step, setStep }) => {
    const router = useRouter();

    const callData = async (data) => {
        if (step !== "step3") {
            setStep('step3')
            const res = await callApi(data);
            if (res.error) {
                setStep("step2")
                return
            }
            router.push("/search");
        }
    }
    return (
        <div className="grid max-w-[900px] px-4 md:px-0 w-full grid-cols-2 md:grid-cols-4 gap-4 mt-10 md:mt-20">
            <GridBox onClick={callData} text="heart pain" />
            <GridBox onClick={callData} text="nausea" />
            <GridBox onClick={callData} text="burn" />
            <GridBox onClick={callData} text="wound" />
            <GridBox onClick={callData} text="freeze" />
            <GridBox onClick={callData} text="head ach" />
            <GridBox onClick={callData} text="frozen shoulder" />
            <GridBox onClick={callData} text="severe body pain " />
        </div>
    )
}