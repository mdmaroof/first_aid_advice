"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  Activity, ArrowRight, Building2, CalendarCheck2, Check, ChevronRight,
  FileHeart, HeartHandshake, HeartPulse, Menu, MessageCircleHeart, Pill, ShieldCheck,
  Sparkles, Stethoscope, Users, X, ClipboardList,
} from "lucide-react";
import { BrandMark } from "@curais/ui";
import { StartModal } from "./StartModal";

const patientURL = process.env.NEXT_PUBLIC_PATIENT_APP_URL || "http://localhost:3000";
const doctorURL = process.env.NEXT_PUBLIC_DOCTOR_APP_URL || "http://localhost:3001";

const reveal = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: .62, ease: [.22, 1, .36, 1] } } };

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative min-h-dvh overflow-clip">
      <motion.div className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-aid-teal" style={{ width: reduceMotion ? "0%" : progress }} />
      <div className="noise pointer-events-none absolute inset-x-0 top-0 h-[52rem] opacity-30" />
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} openModal={setModal} />

      <main>
        <Hero openModal={setModal} reduceMotion={reduceMotion} />
        <TrustStrip />
        <Journey />
        <PatientSection openModal={setModal} />
        <FamilySection />
        <ClinicSection openModal={setModal} />
        <SafetySection />
        <FinalCTA openModal={setModal} />
      </main>

      <Footer openModal={setModal} />
      <AnimatePresence>{modal ? <StartModal type={modal} onClose={() => setModal(null)} patientURL={patientURL} doctorURL={doctorURL} /> : null}</AnimatePresence>
    </div>
  );
}

function Navigation({ menuOpen, setMenuOpen, openModal }) {
  const links = [["#how", "How it works"], ["#patients", "For patients"], ["#clinics", "For clinics"], ["#safety", "Safety"]];
  return <header className="site-shell sticky top-0 z-50 pt-3"><nav className="glass-strong flex min-h-16 items-center justify-between rounded-2xl px-4 sm:px-5" aria-label="Main navigation"><a href="#top" className="rounded-xl"><BrandMark compact /></a><div className="hidden items-center gap-1 lg:flex">{links.map(([href,label])=><a key={href} href={href} className="rounded-xl px-3 py-2 text-sm font-bold text-aid-muted transition hover:bg-white/45 hover:text-aid-ink">{label}</a>)}</div><div className="hidden items-center gap-2 sm:flex"><a href={`${patientURL}/signin`} className="rounded-xl px-3 py-2 text-sm font-bold text-aid-teal">Sign in</a><button onClick={()=>openModal("start")} className="button-primary min-h-10 rounded-xl px-4 py-2">Get started <ArrowRight className="h-4 w-4" /></button></div><button className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/45 lg:hidden" onClick={()=>setMenuOpen(v=>!v)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</button></nav><AnimatePresence>{menuOpen?<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="glass-strong mt-2 rounded-2xl p-3 lg:hidden">{links.map(([href,label])=><a key={href} href={href} onClick={()=>setMenuOpen(false)} className="block rounded-xl px-3 py-3 font-bold text-aid-muted hover:bg-white/50">{label}</a>)}<div className="mt-2 grid grid-cols-2 gap-2"><a href={`${patientURL}/signin`} className="button-secondary">Sign in</a><button onClick={()=>{setMenuOpen(false);openModal("start")}} className="button-primary">Get started</button></div></motion.div>:null}</AnimatePresence></header>;
}

function Hero({ openModal, reduceMotion }) {
  return <section id="top" className="site-shell relative grid min-h-[calc(100dvh-5rem)] items-center gap-10 pb-16 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:pb-24 lg:pt-20"><motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:.1}}}}><motion.div variants={reveal} className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold text-aid-teal"><Sparkles className="h-4 w-4" />Care, made more present by intelligence</motion.div><motion.h1 variants={reveal} className="mt-6 max-w-4xl font-quicksand text-[clamp(3.25rem,8vw,6.7rem)] font-bold leading-[.93] tracking-[-.055em] text-aid-ink">Clear help now.<span className="mt-2 block text-aid-teal">Better care next.</span></motion.h1><motion.p variants={reveal} className="body-copy mt-7 max-w-2xl">Curais helps you act during a health moment, keep the context that matters, and share it with the people caring for you—only when you choose.</motion.p><motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={()=>openModal("immediate")} className="button-primary"><HeartPulse className="h-5 w-5" />Try Immediate Care</button><button onClick={()=>openModal("start")} className="button-secondary">Explore Curais <ChevronRight className="h-4 w-4" /></button></motion.div><motion.p variants={reveal} className="mt-5 flex max-w-xl items-start gap-2 text-sm leading-6 text-aid-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aid-teal" />Guidance, not diagnosis. Your health information stays under your control.</motion.p></motion.div><motion.div initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:.8,ease:[.22,1,.36,1]}} className="relative mx-auto w-full max-w-[38rem]"><div className="absolute inset-12 rounded-full bg-aid-seafoam/25 blur-3xl"/><motion.div animate={reduceMotion?undefined:{y:[0,-10,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}} className="glass-strong relative rounded-[2.5rem] p-5 sm:p-7"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-aid-teal text-white"><HeartPulse/></span><div><p className="font-quicksand font-bold">Your care journey</p><p className="text-xs text-aid-muted">One calm step at a time</p></div></div><span className="rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-800">You control access</span></div><div className="mt-6 space-y-3"><JourneyRow icon={Activity} step="01" title="Get clear immediate guidance" text="Curated first-aid steps stay close to emergency action." active/><JourneyRow icon={FileHeart} step="02" title="Keep your health context" text="Allergies, medication, history and family context in one place."/><JourneyRow icon={Stethoscope} step="03" title="Share with your clinic" text="Permission is explicit, bounded and revocable."/></div></motion.div><motion.div animate={reduceMotion?undefined:{y:[0,8,0]}} transition={{duration:4.3,repeat:Infinity,ease:"easeInOut"}} className="glass absolute -bottom-6 -left-2 hidden items-center gap-3 rounded-2xl p-3 sm:flex"><span className="rounded-xl bg-white/60 p-2 text-aid-teal"><Users className="h-5 w-5" /></span><div><p className="text-xs font-bold">Family context</p><p className="text-[11px] text-aid-muted">Connected by consent</p></div></motion.div></motion.div></section>;
}

function JourneyRow({ icon:Icon,step,title,text,active=false }) { return <div className={`rounded-2xl border p-4 ${active?"border-aid-teal/20 bg-aid-teal/10":"border-white/60 bg-white/30"}`}><div className="flex items-start gap-3"><span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active?"bg-aid-teal text-white":"bg-white/60 text-aid-teal"}`}><Icon className="h-5 w-5"/></span><div className="min-w-0"><p className="text-[10px] font-extrabold tracking-[.18em] text-aid-teal">STEP {step}</p><p className="font-quicksand text-sm font-bold sm:text-base">{title}</p><p className="mt-1 text-xs leading-5 text-aid-muted">{text}</p></div></div></div> }

function TrustStrip() {
  const points = [
    {
      icon: HeartHandshake,
      title: "Human-first",
      text: "AI supports care; it never replaces the judgment of a professional.",
      label: "Clinical oversight",
      tone: "from-[#d7f3ec] to-[#eef9f5]",
    },
    {
      icon: ShieldCheck,
      title: "Consent-led",
      text: "Share only what you choose, with clear controls to revoke access.",
      label: "Granular control",
      tone: "from-[#d8eef5] to-[#f0f8fa]",
    },
    {
      icon: MessageCircleHeart,
      title: "Easy to understand",
      text: "Calm language, readable type and one clear next step at a time.",
      label: "Plain-language care",
      tone: "from-[#e5e5f7] to-[#f5f4fb]",
    },
  ];

  return (
    <section className="site-shell pb-24" aria-labelledby="trust-title">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: .25 }}
        variants={{ show: { transition: { staggerChildren: .09 } } }}
      >
        <div className="mb-5 flex items-end justify-between gap-5 px-1">
          <div>
            <p className="eyebrow">Designed around people</p>
            <h2 id="trust-title" className="mt-2 font-quicksand text-2xl font-bold tracking-tight sm:text-3xl">
              Technology that feels careful, not complicated.
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-6 text-aid-muted lg:block">
            Three principles guide every Curais experience.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {points.map(({ icon: Icon, title, text, label, tone }, index) => (
            <motion.article
              key={title}
              variants={reveal}
              whileHover={{ y: -6 }}
              transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
              className="glass-strong group relative min-h-[17rem] overflow-hidden rounded-[2rem] p-6 sm:p-7"
            >
              <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${tone} opacity-90 blur-xl transition duration-500 group-hover:scale-125`} />
              <div className="relative flex items-start justify-between">
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-aid-teal shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_10px_24px_rgba(10,107,111,.10)]`}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <span className="font-quicksand text-sm font-bold tracking-[.16em] text-aid-teal/35">0{index + 1}</span>
              </div>
              <div className="relative mt-8">
                <h3 className="font-quicksand text-xl font-bold sm:text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-aid-muted sm:text-base">{text}</p>
              </div>
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-2 border-t border-aid-teal/10 pt-4 text-xs font-extrabold uppercase tracking-[.12em] text-aid-teal">
                <span className="h-2 w-2 rounded-full bg-aid-seafoam shadow-[0_0_0_5px_rgba(26,143,152,.10)]" />
                {label}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Journey(){const cards=[[HeartPulse,"Immediate Care","Act with clear first-aid steps and direct emergency escalation."],[ClipboardList,"My Health","Keep allergies, medicines, conditions and care moments together."],[Building2,"Connected care","Give a clinic time-bound access to the context you choose."]];return <section id="how" className="site-shell py-24"><SectionIntro eyebrow="One connected path" title="From uncertain moment to informed care." text="Curais is designed around the way health actually unfolds—not as isolated screens, but as a careful handoff from action to memory to professional care."/><div className="mt-12 grid gap-4 lg:grid-cols-3">{cards.map(([Icon,title,text],index)=><motion.article key={title} variants={reveal} initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} transition={{delay:index*.08}} className="glass-strong group rounded-[2rem] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-aid-teal/10 text-aid-teal transition group-hover:bg-aid-teal group-hover:text-white"><Icon/></span><span className="font-quicksand text-4xl font-bold text-aid-teal/15">0{index+1}</span></div><h3 className="mt-8 font-quicksand text-2xl font-bold">{title}</h3><p className="mt-3 leading-7 text-aid-muted">{text}</p></motion.article>)}</div></section>}

function PatientSection({openModal}){return <section id="patients" className="site-shell py-24"><div className="glass-dark relative overflow-hidden rounded-[2.5rem] px-5 py-10 text-white sm:px-10 lg:grid lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-14 lg:p-14"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-aid-seafoam/25 blur-3xl"/><motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} className="relative"><p className="eyebrow !text-[#79d5ce]">For you and the people you love</p><h2 className="mt-3 font-quicksand text-4xl font-bold leading-tight sm:text-5xl">A health record that feels like yours—because it is.</h2><p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">Build a useful picture over time, connect individual family accounts and decide when a clinician can see your information.</p><button onClick={()=>openModal("start")} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-aid-teal">Open patient app <ArrowRight className="h-4 w-4"/></button></motion.div><div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:mt-0">{[[FileHeart,"Health timeline","See conditions, visits and important events together."],[Pill,"Medication context","Keep current medicines and allergy information close."],[Users,"Family connections","Separate logins, connected only after both people agree."],[ShieldCheck,"Sharing controls","Grant and revoke clinic access from one clear screen."]].map(([Icon,title,text])=><div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"><Icon className="h-5 w-5 text-[#79d5ce]"/><h3 className="mt-5 font-quicksand font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}</div></div></section>}

function FamilySection() {
  const [activeStep, setActiveStep] = useState(0);
  const stories = [
    {
      eyebrow: "01 — Connect",
      title: "Connection starts with an invitation.",
      text: "Every relative keeps a separate Curais account. A family connection appears only after both people agree.",
      points: ["Separate login for every person", "Invite, review and accept", "No silent account linking"],
    },
    {
      eyebrow: "02 — Share context",
      title: "Useful family history—not an open record.",
      text: "A relative can contribute hereditary context without exposing appointments, prescriptions or their complete health timeline.",
      points: ["Family-history permission is separate", "Only relevant context is shared", "Private records remain private"],
    },
    {
      eyebrow: "03 — Stay in control",
      title: "Consent is a living choice.",
      text: "Connections and clinic access stay visible. People can review what is shared and withdraw permission when circumstances change.",
      points: ["Clear active-access status", "Revoke access at any time", "Every change is accountable"],
    },
  ];

  return (
    <section className="site-shell py-24" aria-labelledby="family-story-title">
      <div className="grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:flex lg:h-[calc(100dvh-8.5rem)] lg:items-center">
          <FamilyStoryVisual activeStep={activeStep} />
        </div>

        <div>
          <div className="mb-14 lg:mb-6 lg:min-h-[38vh] lg:pt-12">
            <p className="eyebrow">Family context, with boundaries</p>
            <h2 id="family-story-title" className="section-title mt-3">
              Health can run in families. Access should not.
            </h2>
            <p className="body-copy mt-5">
              Curais connects the context that can improve care while keeping every person’s record and choices distinct.
            </p>
          </div>

          {stories.map((story, index) => (
            <motion.article
              key={story.title}
              onViewportEnter={() => setActiveStep(index)}
              viewport={{ amount: .62 }}
              initial={{ opacity: .4 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: .35 }}
              className="flex min-h-[62vh] items-center py-10 lg:min-h-[78vh]"
            >
              <div className={`w-full rounded-[2rem] border p-6 transition duration-500 sm:p-8 ${activeStep === index ? "border-white/80 bg-white/55 shadow-[0_24px_70px_rgba(18,32,38,.09)] backdrop-blur-2xl" : "border-transparent"}`}>
                <p className="eyebrow">{story.eyebrow}</p>
                <h3 className="mt-4 max-w-xl font-quicksand text-3xl font-bold leading-tight sm:text-4xl">{story.title}</h3>
                <p className="mt-5 max-w-xl text-base leading-8 text-aid-muted sm:text-lg">{story.text}</p>
                <ul className="mt-7 grid gap-3">
                  {story.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm font-bold text-aid-muted sm:text-base">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aid-teal/10 text-aid-teal">
                        <Check className="h-4 w-4" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FamilyStoryVisual({ activeStep }) {
  const labels = ["A mutual connection", "Only selected context", "Permission stays visible"];

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: .25 }}
      className="glass-strong relative mx-auto min-h-[28rem] w-full max-w-[34rem] overflow-hidden rounded-[2.5rem] p-6 sm:p-8"
    >
      <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-aid-seafoam/15 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="eyebrow">Your family circle</p>
          <p className="mt-2 font-quicksand text-lg font-bold">{labels[activeStep]}</p>
        </div>
        <span className="rounded-full bg-aid-teal/10 px-3 py-2 text-xs font-extrabold text-aid-teal">
          0{activeStep + 1} / 03
        </span>
      </div>

      <div className="relative mt-8 h-[19rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 18, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: .98 }}
            transition={{ duration: .38, ease: [.22, 1, .36, 1] }}
            className="absolute inset-0"
          >
            {activeStep === 0 ? <ConnectionVisual /> : null}
            {activeStep === 1 ? <ContextVisual /> : null}
            {activeStep === 2 ? <ControlVisual /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((step) => (
          <span key={step} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step <= activeStep ? "bg-aid-teal" : "bg-aid-teal/10"}`} />
        ))}
      </div>
    </motion.div>
  );
}

function ConnectionVisual() {
  return (
    <div className="relative h-full">
      <div className="absolute left-1/2 top-0 z-20 flex min-w-44 -translate-x-1/2 items-center gap-3 rounded-2xl bg-aid-teal p-3 pr-5 text-white shadow-[0_16px_35px_rgba(10,107,111,.24)]">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
          <HeartPulse className="h-5 w-5" />
        </span>
        <div>
          <p className="font-quicksand text-sm font-bold">Your profile</p>
          <p className="mt-0.5 text-[11px] text-white/65">Connection owner</p>
        </div>
      </div>

      <div className="absolute left-1/2 top-[4.5rem] h-[3.35rem] w-px -translate-x-1/2 bg-gradient-to-b from-aid-teal/45 to-aid-teal/20" />
      <div className="absolute left-[20%] right-[20%] top-[7.75rem] h-px bg-aid-teal/20" />
      <div className="absolute left-[20%] top-[7.75rem] h-[4.7rem] w-px bg-gradient-to-b from-aid-teal/20 to-aid-teal/35" />
      <div className="absolute right-[20%] top-[7.75rem] h-[4.7rem] w-px bg-gradient-to-b from-aid-teal/20 to-aid-teal/35" />

      <motion.span
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[7.37rem] z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-aid-seafoam shadow-[0_0_0_6px_rgba(26,143,152,.10)]"
      />
      <div className="glass absolute left-1/2 top-[8.65rem] z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-aid-teal">
        Both accepted
      </div>

      <StoryNode className="bottom-2 left-0 sm:left-4" label="Parent" initial="P" />
      <StoryNode className="bottom-2 right-0 sm:right-4" label="Sibling" initial="S" />
    </div>
  );
}

function ContextVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="rounded-2xl border border-aid-teal/20 bg-aid-teal p-5 text-white shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-3 font-quicksand font-bold"><FileHeart className="h-5 w-5" />Family-history context</span>
          <Check className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm text-white/70">Diabetes and cardiac history</p>
      </div>
      <div className="rounded-2xl border border-white/70 bg-white/45 p-5 text-aid-muted backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-3 font-quicksand font-bold"><ClipboardList className="h-5 w-5" />Complete health record</span>
          <ShieldCheck className="h-5 w-5 text-aid-teal" />
        </div>
        <p className="mt-3 text-sm">Private unless separately shared</p>
      </div>
    </div>
  );
}

function ControlVisual() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="glass rounded-[2rem] p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-aid-teal text-white"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <p className="font-quicksand font-bold">Family-history access</p>
            <p className="text-xs text-aid-muted">Shared with Meera Family Clinic</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50/80 p-3">
          <span className="text-sm font-bold text-emerald-800">Active with consent</span>
          <span className="relative h-7 w-12 rounded-full bg-aid-teal"><span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow" /></span>
        </div>
        <div className="mt-3 w-full rounded-xl border border-aid-emergency/20 bg-red-50/70 px-4 py-3 text-center text-sm font-extrabold text-aid-emergency">
          Revoke access
        </div>
      </div>
    </div>
  );
}

function StoryNode({ className, label, initial }) {
  return (
    <div className={`absolute z-10 w-[8.6rem] rounded-2xl border border-white/80 bg-white/70 p-3 shadow-[0_14px_30px_rgba(18,32,38,.10),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-2xl sm:w-[9.4rem] ${className}`}>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aid-teal/10 font-quicksand text-sm font-bold text-aid-teal">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="font-quicksand text-sm font-bold">{label}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
            <Check className="h-3 w-3" /> Connected
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-aid-teal/10 pt-2 text-[10px] text-aid-muted">
        <span>Separate account</span>
        <ShieldCheck className="h-3.5 w-3.5 text-aid-teal" />
      </div>
    </div>
  );
}

function ClinicSection({openModal}){return <section id="clinics" className="site-shell py-24"><SectionIntro eyebrow="For clinics and hospitals" title="A focused EMR, built around patient permission." text="Give clinicians the context they need without turning every record into an open directory. Curais keeps consent visible inside the workflow."/><div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}} className="glass-strong rounded-[2rem] p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow">Clinical command center</p><h3 className="mt-2 font-quicksand text-2xl font-bold">Today at a glance</h3></div><span className="rounded-full bg-aid-teal/10 px-3 py-2 text-xs font-bold text-aid-teal">Consent checked on every record</span></div><div className="mt-7 grid gap-3 sm:grid-cols-4">{[[Users,"24","Patients"],[CalendarCheck2,"8","Appointments"],[ClipboardList,"3","Draft notes"],[Activity,"5","Labs"]].map(([Icon,value,label])=><div key={label} className="glass rounded-2xl p-4"><Icon className="h-4 w-4 text-aid-teal"/><p className="mt-5 font-quicksand text-2xl font-bold">{value}</p><p className="text-xs text-aid-muted">{label}</p></div>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Appointments and patient lookup","Encounters, vitals and SOAP notes","Medication instructions","Routine and urgent lab orders"].map(text=><div key={text} className="flex items-center gap-3 rounded-xl bg-white/40 p-3 text-sm font-bold"><Check className="h-4 w-4 text-aid-teal"/>{text}</div>)}</div></motion.div><motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}} className="glass-dark flex flex-col justify-between rounded-[2rem] p-7 text-white"><div><Stethoscope className="h-8 w-8 text-[#79d5ce]"/><h3 className="mt-8 font-quicksand text-3xl font-bold">Bring calm structure to everyday care.</h3><p className="mt-4 leading-7 text-white/65">Designed first for small clinics and growing care teams that need clarity, continuity and accountable access.</p></div><button onClick={()=>openModal("demo")} className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-aid-teal">Request a clinic walkthrough <ArrowRight className="h-4 w-4"/></button></motion.div></div></section>}

function SafetySection() {
  const safeguards = [
    [HeartPulse, "Guidance, not diagnosis", "Immediate Care gives general first-aid steps and clear escalation—not a confirmed condition."],
    [FileHeart, "Minimum necessary data", "Health information is collected for a defined capability and protected behind an account."],
    [ShieldCheck, "Consent before access", "A clinic sees a record only through an active patient sharing grant."],
    [MessageCircleHeart, "Accessible by design", "Readable type, keyboard support, large touch targets and reduced-motion behavior are built in."],
  ];

  return (
    <section id="safety" className="site-shell py-24">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: .2 }}
        className="glass-strong grid gap-3 overflow-hidden rounded-[2.75rem] p-3 sm:p-4 lg:grid-cols-[.86fr_1.14fr]"
      >
        <div className="glass-dark relative flex min-h-[35rem] flex-col overflow-hidden rounded-[2.2rem] p-7 text-white sm:p-10">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border-[54px] border-white/5" />
          <div className="absolute -bottom-36 -left-28 h-80 w-80 rounded-full bg-aid-seafoam/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-extrabold text-[#8adbd4] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#79d5ce] shadow-[0_0_0_5px_rgba(121,213,206,.10)]" />
              Trust system active
            </span>
            <span className="font-quicksand text-sm font-bold text-white/35">04 safeguards</span>
          </div>

          <div className="relative mt-12">
            <p className="eyebrow !text-[#79d5ce]">Trust is a feature</p>
            <h2 className="mt-4 max-w-lg font-quicksand text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Calm by default.<span className="mt-2 block text-[#8adbd4]">Urgent when it matters.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-white/65">
              Safety is not a disclaimer at the bottom of Curais. It shapes the guidance, permissions and interface from the first screen.
            </p>
          </div>

          <div className="relative mt-auto pt-10">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-2xl">
              <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-aid-teal shadow-xl">
                <ShieldCheck className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#173a3e] bg-emerald-400" />
              </span>
              <div>
                <p className="font-quicksand font-bold">Protection stays visible</p>
                <p className="mt-1 text-xs leading-5 text-white/55">Clear boundaries at every important decision.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.2rem] bg-white/25 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="flex items-end justify-between gap-5 border-b border-aid-teal/10 pb-6">
            <div>
              <p className="eyebrow">Built into every layer</p>
              <h3 className="mt-2 font-quicksand text-2xl font-bold sm:text-3xl">Four safeguards. One calmer experience.</h3>
            </div>
            <Sparkles className="hidden h-6 w-6 text-aid-seafoam sm:block" />
          </div>

          <div>
            {safeguards.map(([Icon, title, text], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: .55 }}
                transition={{ delay: index * .06, duration: .45 }}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-aid-teal/10 py-6 last:border-b-0"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-aid-teal/10 text-aid-teal transition duration-300 group-hover:bg-aid-teal group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-quicksand text-base font-bold sm:text-lg">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-aid-muted">{text}</p>
                </div>
                <span className="pt-1 font-quicksand text-xs font-bold tracking-[.14em] text-aid-teal/30">0{index + 1}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FinalCTA({openModal}){return <section className="site-shell py-24"><motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} className="relative overflow-hidden rounded-[2.75rem] bg-aid-teal px-6 py-14 text-center text-white shadow-[0_30px_90px_rgba(10,107,111,.28)] sm:px-12 sm:py-20"><div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[55px] border-white/5"/><div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full border-[65px] border-white/5"/><Sparkles className="relative mx-auto h-7 w-7 text-[#a6e5df]"/><h2 className="relative mx-auto mt-5 max-w-3xl font-quicksand text-4xl font-bold leading-tight sm:text-5xl">Care should feel clearer from the very first step.</h2><p className="relative mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">Start with Immediate Care, build your record at your pace, or bring Curais into your clinic workflow.</p><div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={()=>openModal("start")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-aid-teal">Choose your Curais app <ArrowRight className="h-4 w-4"/></button><button onClick={()=>openModal("demo")} className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-xl">Talk to us</button></div></motion.div></section>}

function Footer({openModal}){return <footer className="mt-16 border-t border-white/55 bg-white/25 backdrop-blur-2xl"><div className="site-shell grid gap-10 py-12 md:grid-cols-[1.2fr_.8fr_.8fr_.8fr]"><div><BrandMark/><p className="mt-4 max-w-sm text-sm leading-6 text-aid-muted">Clear help in the moment. Better context for the care that follows.</p><p className="mt-4 text-xs text-aid-muted">Curais does not replace emergency services or professional medical advice.</p></div><FooterGroup title="Product" links={[["#how","How it works"],["#patients","Patients"],["#clinics","Clinics"]]}/><FooterGroup title="Access" links={[[`${patientURL}/signin`,"Patient app"],[`${doctorURL}/signin`,"Doctor EMR"]]}/><FooterGroup title="Company" links={[["/privacy","Privacy"],["/terms","Terms"]]}/></div><div className="site-shell flex flex-col gap-3 border-t border-white/55 py-6 text-xs text-aid-muted sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Curais. Care, made more present by intelligence.</p><button onClick={()=>openModal("demo")} className="w-fit font-bold text-aid-teal">Contact Curais</button></div></footer>}
function FooterGroup({title,links}){return <div><h2 className="font-quicksand text-sm font-bold">{title}</h2><ul className="mt-4 space-y-3">{links.map(([href,label])=><li key={label}><a href={href} className="text-sm text-aid-muted transition hover:text-aid-teal">{label}</a></li>)}</ul></div>}

function SectionIntro({eyebrow,title,text}){return <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} className="max-w-3xl"><p className="eyebrow">{eyebrow}</p><h2 className="section-title mt-3">{title}</h2><p className="body-copy mt-5">{text}</p></motion.div>}
