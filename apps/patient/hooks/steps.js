"use client";
import { useState } from "react"

export const useStepTracker = () => {
    const [step, setStep] = useState('step1') //step1 ,step2, step3 
    return { step, setStep }
}