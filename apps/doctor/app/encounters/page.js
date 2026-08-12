import { EMRPage } from "@/components/doctor/EMRPage";
export const metadata={title:"Encounters | Curais Doctor"};
export default function Page(){return <EMRPage resource="encounters" eyebrow="Clinical documentation" title="Encounters and vitals" description="Record vitals, SOAP-style clinical context, assessment, and care plan."/>}
