"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
    const [result, setResult] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getData = localStorage.getItem("getData");
        const data = JSON.parse(getData)?.content[0] || null;
        const res = JSON.parse(data.text.value);
        setResult(res)
    }, []);

    const { first_instance, instant_help, medical_advice, symptoms_option } = result || {};
    return (
        <main className="fixed overflow-y-scroll bg-[#ff7b73] w-full h-full text-white px-2 md:px-10 py-5">
            <div className="flex flex-col">
                <div className="text-3xl">Looking Like {first_instance?.disease}</div>
                <div className="text-md">{first_instance?.accuracy} Chances</div>
            </div>

            <div className="text-white mt-2">
                {medical_advice}
            </div>

            <div className="mt-7 md:mt-10 flex flex-col gap-5 bg-white py-5 px-2 md:px-5 rounded-lg">
                <div className="text-xl text-[#ff7b73]">Look for other Symptoms</div>
                {symptoms_option && symptoms_option.length > 0 && symptoms_option.map((z, i) => {
                    return (
                        <div className="border-[#ff7b73] border-2 px-5 py-3 rounded-md" key={i}>
                            <div className="text-[#ff7b73] text-xl">{z.symptom}</div>
                            <div className="text-black font-light">{z.description}</div>
                        </div>
                    )
                })}
            </div>


            <div className="mt-7 md:mt-10 flex flex-col gap-3 bg-white py-5 px-5 rounded-lg">
                <div className="text-xl text-[#ff7b73]">Adviced Help</div>
                {instant_help && instant_help.length > 0 && instant_help.map((z, i) => {
                    return (
                        <div className="flex gap-1" key={i}>
                            <div className="text-[#ff7b73] text-md">{z.step}.)</div>      <div className="text-[#ff7b73] text-md">{z.info}</div>
                        </div>
                    )
                })}
            </div>

            <div className="p-1 w-fit border-4 border-white rounded-full mt-7 md:mt-10">
                <div
                    onClick={() => router.push("/")}
                    className="w-fit font-bold text-[#ff7b73] bg-white py-3 px-10 text-xl rounded-full gap-1 relative cursor-pointer flex justify-center items-center"
                >
                    Search New Symptoms
                </div>
            </div>

        </main>
    )
}

export default SearchPage;