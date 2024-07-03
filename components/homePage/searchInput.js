"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStepTracker } from "@/hooks/steps";
import { callApi } from '@/hooks/callApi';
import { useRouter } from 'next/navigation';


const ButtonComponent = ({ text, onClick, initial = {}, animate = {}, exit = {}, search = false }) => {
    return (
        <div className="p-1 border-4 border-white rounded-full">
            <motion.div
                exit={exit}
                initial={initial}
                animate={animate}
                onClick={onClick}
                className="max-w-[312px] font-bold text-[#ff7b73] bg-white py-3 px-10 text-xl rounded-full gap-1 relative cursor-pointer flex justify-center items-center"
            >
                {text} {search && <span className="loader ml-2"></span>}
            </motion.div>
        </div>

    )
}

const InputSearchBox = ({ onClick, input, setInput }) => {

    return (
        <div className="p-1 border-4 border-white rounded-full">
            <motion.div
                initial={{ width: 250 }}
                animate={{ width: 340 }}
                className="text-[#ff7b73] bg-white p-1 text-xl rounded-full gap-1 relative cursor-pointer flex flex-row"
            >
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="text-lg flex-1 bg-transparent focus-visible:outline-0 pl-2 pr-1" />
                <div
                    className="bg-[#ff7b73] flex-auto text-white py-2 px-4 rounded-full font-bold"
                    onClick={onClick}
                >
                    Search
                </div>
            </motion.div>
        </div>
    )
}

export const SearchInput = ({ step, setStep }) => {
    const [input, setInput] = useState('');
    const router = useRouter();


    const stepMarker = async () => {
        if (step === 'step1') {
            setStep("step2")
        }
        if (step === 'step2') {
            if (input) {
                setStep('step3')
                const res = await callApi(input);
                if (res.error) {
                    setStep("step2")
                    return
                }
                router.push("/search");
            }
        }
    }

    return (
        <div className="flex justify-center items-center mt-10 md:mt-20">
            <AnimatePresence mode="wait">
                {step === "step1" && <ButtonComponent onClick={stepMarker} exit={{ opacity: 0 }} text="Type symptoms" />}
                {step === "step2" && <InputSearchBox input={input} setInput={setInput} onClick={stepMarker} text="Write symptoms" />}
                {step === "step3" && <ButtonComponent initial={{ width: 340 }} animate={{ width: 230 }} text="Searching" search={true} />}
            </AnimatePresence>
        </div>
    )
}