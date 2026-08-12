import { EMRPage } from "@/components/doctor/EMRPage";
export const metadata={title:"Labs | Curais Doctor"};
export default function Page(){return <EMRPage resource="labs" eyebrow="Diagnostics" title="Lab orders" description="Create and track routine or urgent diagnostic orders."/>}
