import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button, TextInput, Select, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hrLogin, hrRegister, login } from "../Reducer/AuthSlice";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";


import talentFoldLogo from "../talentfoldLogo.png";
import coding from "../coding_img.jpg"

const LandingPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [errMsg, setErrorMsg] = useState("");
  const [regMsg, setRegMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const {
    register: registerUser,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm();

  const role = watch("role");

  const onSubmit = (data) => {
    if (data?.role === "superadmin") {
      dispatch(login(data)).then((res) => {
        if (res?.payload?.statusCode === 200) {
          setErrorMsg("");
          navigate("/dashboard");
        } else {
          setErrorMsg(res?.payload?.response?.data?.message || "Login failed");
        }
      });
    } else {
      const payload = {
        email: data?.usernameOrEmail,
        password: data?.password,
      };
      dispatch(hrLogin(payload)).then((res) => {
        if (res?.payload?.statusCode === 200) {
          setErrorMsg("");
          navigate("/dashboard");
        } else {
          setErrorMsg(res?.payload?.response?.data?.message || "Login failed");
        }
      });
    }
  };

  const onRegister = (data) => {
    setErrorMsg("");
    setRegMsg("");
    dispatch(hrRegister(data)).then((res) => {
      console.log("Registration response:", res);
      if (res?.payload?.statusCode === 200) {
        setRegMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
          setOpenRegisterModal(false);
          setRegMsg("");
        }, 2000);
      } else {
        setErrorMsg(res?.payload?.response?.data?.message || "Registration failed");
      }
    });
  };

  return (
    <div className="bg-surface-container-lowest selection:bg-primary selection:text-on-primary-fixed min-h-screen text-white font-body overflow-x-hidden">
      {/* Custom Styles */}
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(38, 38, 38, 0.4);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(73, 72, 71, 0.15);
        }
        .hero-glow {
            background: radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
        }
        .neural-bg {
            background-image: radial-gradient(circle at 2px 2px, rgba(168, 85, 247, 0.05) 1px, transparent 0);
            background-size: 40px 40px;
        }
        .text-gradient {
            background: linear-gradient(135deg, #d946ef 0%, #ac89ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .btn-primary-gradient {
            background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
        }
        /* Fix native select options in dark mode */
        select option {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
            padding: 10px;
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 neural-bg opacity-30"></div>
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/40 dark:bg-[#0e0e0e]/40 backdrop-blur-xl shadow-[0_40px_40px_0_rgba(168,85,247,0.1)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          {/* <div className="flex items-center gap-3 text-2xl font-black text-on-surface tracking-tighter font-headline">
            <img src={talentFoldLogo} alt="TalentFold Logo" className="w-[200px] h-[50px] object-contain" />
          </div> */}
          <div className="flex">
            <div className="flex items-center font-bold text-[#D946EF] text-xl whitespace-nowrap">
              <div>Interview</div>
              <span>Fold</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-10 font-headline font-bold tracking-tight">
            <a className="text-[#D946EF] border-b-2 border-[#D946EF] pb-1 transition-colors duration-300" href="#">Platform</a>
            {/* <a className="text-on-surface-variant hover:text-[#D946EF] transition-colors duration-300" href="#">Features</a>
            <a className="text-on-surface-variant hover:text-[#D946EF] transition-colors duration-300" href="#">Demo</a>
            <a className="text-on-surface-variant hover:text-[#D946EF] transition-colors duration-300" href="#">Pricing</a> */}
          </div>
          <div className="flex items-center gap-4">
            {/* <button 
              onClick={() => setOpenRegisterModal(true)}
              className="hidden md:block text-on-surface-variant hover:text-white font-bold text-sm tracking-tight transition-colors"
            >
              Sign Up
            </button> */}
            <button
              onClick={() => setOpenModal(true)}
              className="bg-primary text-on-primary-fixed px-6 py-2.5 rounded-full font-bold text-sm tracking-tight scale-95 active:scale-90 transition-transform hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]"
            >
              Start Hiring
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/15 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">V2.0 Engine Live</span>
            </div>
            <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tighter text-on-surface mb-6 leading-[0.9]">
              AI Interviews That <br />
              <span className="text-gradient">Think, Evaluate, and Hire</span>
            </h1>
            <p className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Experience the future of hiring with intelligent AI interviews and coding assessments. No more scheduling nightmares, just unbiased, deep technical evaluation.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-24">
              <Button
                onClick={() => setOpenModal(true)}
                className="btn-primary-gradient text-on-primary-fixed border-none px-10 py-4 rounded-full font-bold text-lg shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform"
              >
                Start Hiring
              </Button>
              {/* <button 
                onClick={() => setOpenRegisterModal(true)}
                className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-full font-bold text-lg border border-outline-variant/20 hover:bg-surface-bright transition-colors"
              >
                Create Account
              </button> */}
            </div>
            {/* Floating UI Mockup */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-[500px] hero-glow"></div>
              <div className="relative glass-panel rounded-xl p-2 md:p-4 shadow-2xl flex-col md:flex-row gap-4 aspect-[16/9] md:aspect-video overflow-hidden group">

                {/* <div className="w-full md:w-1/3 bg-surface-container-low rounded-lg p-6 flex flex-col border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">Sentient Interrogator</div>
                      <div className="text-[10px] text-primary uppercase tracking-widest">Active Session</div>
                    </div>
                  </div>
                  <div className="space-y-6 flex-1 overflow-hidden">
                    <div className="bg-surface-container-high p-4 rounded-lg text-left text-sm text-on-surface-variant max-w-[90%]">
                      Can you explain how you would optimize the time complexity of the current function?
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-left text-sm text-primary max-w-[90%] ml-auto border border-primary/20">
                      I'd implement a hash map to reduce it from O(n²) to O(n).
                    </div>
                    <div className="bg-surface-container-high p-4 rounded-lg text-left text-sm text-on-surface-variant max-w-[90%]">
                      Correct. Now, let's look at the memory constraints...
                    </div>
                  </div>
                </div>
               
                <div className="flex-1 bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 flex flex-col">
                  <div className="h-10 bg-surface-container-high flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/30"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary/30"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                    <span className="ml-4 text-[10px] font-label text-on-surface-variant tracking-widest">solution.py</span>
                  </div>
                  <div className="p-8 text-left font-mono text-sm leading-relaxed text-on-surface-variant/80">
                    <div className="flex gap-4"><span className="text-outline/40">01</span> <span className="text-secondary">import</span> collections</div>
                    <div className="flex gap-4"><span className="text-outline/40">02</span> </div>
                    <div className="flex gap-4"><span className="text-outline/40">03</span> <span className="text-secondary">class</span> <span className="text-primary">Solution</span>:</div>
                    <div className="flex gap-4"><span className="text-outline/40">04</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">def</span> <span className="text-tertiary">optimize_hiring</span>(self, data):</div>
                    <div className="flex gap-4"><span className="text-outline/40">05</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-outline-variant"># Initialize cache</span></div>
                    <div className="flex gap-4"><span className="text-outline/40">06</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cache = collections.defaultdict(int)</div>
                    <div className="flex gap-4"><span className="text-outline/40">07</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">for</span> item <span className="text-secondary">in</span> data:</div>
                    <div className="flex gap-4"><span className="text-outline/40">08</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cache[item] += <span className="text-tertiary">1</span></div>
                    <div className="flex gap-4"><span className="text-outline/40">09</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">return</span> cache<span className="animate-pulse w-2 h-4 bg-primary inline-block align-middle ml-1"></span></div>
                  </div>
                </div> */}

                <img src={coding} />
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left md:flex md:items-end md:justify-between">
            <div>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">Precision Engineering <br />for HR Teams</h2>
              <p className="font-body text-on-surface-variant max-w-xl">Our architecture is built on the same foundations as LLMs, optimized specifically for technical talent discovery.</p>
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-label text-primary uppercase tracking-[0.3em]">Core Technologies</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* AI Interviewer */}
            <div className="md:col-span-8 glass-panel rounded-xl p-8 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col">
                <span className="material-symbols-outlined text-primary-fixed-dim text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h3 className="font-headline text-3xl font-bold mb-4">AI Interviewer</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">Real-time voice and text interaction that adapts its difficulty based on candidate performance. It doesn't just ask—it probes for depth.</p>
                <div className="mt-auto pt-12 flex gap-4">
                  <span className="px-3 py-1 rounded-full bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest border border-outline-variant/10">Voice Synthesis</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest border border-outline-variant/10">Emotional Intelligence</span>
                </div>
              </div>
            </div>
            {/* RAG Engine */}
            <div className="md:col-span-4 glass-panel rounded-xl p-8 hover:border-secondary/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-2xl -mr-10 -mt-10 group-hover:bg-secondary/10 transition-colors"></div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
                <h3 className="font-headline text-2xl font-bold mb-4">RAG Question Engine</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Retrieval-Augmented Generation ensures questions are unique to every candidate, preventing leaks and cheating.</p>
              </div>
            </div>
            {/* Live Coding IDE */}
            <div className="md:col-span-5 glass-panel rounded-xl p-8 hover:border-tertiary/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-tertiary/5 blur-3xl -ml-10 -mb-10 group-hover:bg-tertiary/10 transition-colors"></div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-tertiary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                <h3 className="font-headline text-2xl font-bold mb-4">Live Coding IDE</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Integrated development environment with terminal support and multi-language compilers for authentic testing.</p>
              </div>
            </div>
            {/* Automated Scoring */}
            <div className="md:col-span-7 glass-panel rounded-xl p-8 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  <h3 className="font-headline text-2xl font-bold mb-4">Automated Scoring</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Instant comprehensive reports with code quality metrics, problem-solving scores, and communication feedback.</p>
                </div>
                <div className="w-full md:w-48 aspect-square bg-surface-container-high rounded-lg border border-outline-variant/10 flex items-center justify-center p-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold font-headline text-primary">94</span>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full border-t-transparent -rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">The Talent Pipeline, Reimagined</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">From sourcing to offer, InterviewFold automates the friction-heavy assessment phase.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent -translate-y-12"></div>
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl glass-panel flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(168,85,247,0.1)] transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-primary text-4xl">link</span>
                </div>
                <h4 className="font-headline text-2xl font-bold mb-4 text-on-surface">1. Send Invites</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed px-4">From sourcing to offer, InterviewFold automates the friction-heavy assessment phase.</p>
              </div>
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl glass-panel flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(172,137,255,0.1)]">
                  <span className="material-symbols-outlined text-secondary text-4xl">video_chat</span>
                </div>
                <h4 className="font-headline text-2xl font-bold mb-4 text-on-surface">2. AI Interrogation</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed px-4">Candidates engage with InterviewFold in a structured but flexible 45-minute technical deep dive.</p>
              </div>
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl glass-panel flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(77,175,255,0.1)]">
                  <span className="material-symbols-outlined text-tertiary text-4xl">verified</span>
                </div>
                <h4 className="font-headline text-2xl font-bold mb-4 text-on-surface">3. Review &amp; Hire</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed px-4">From sourcing to offer, InterviewFold automates the friction-heavy assessment phase.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[#050505]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[180px] rounded-full"></div>
          </div>
          <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-12 md:p-24 text-center relative z-10 overflow-hidden border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
            <h2 className="font-headline text-4xl md:text-7xl font-bold tracking-tighter mb-8 text-on-surface">Ready to Transform Your Hiring?</h2>
            <p className="font-body text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">Join 500+ engineering teams cutting time-to-hire by 65% while increasing technical bar.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setOpenModal(true)}
                className="w-full md:w-auto btn-primary-gradient text-on-primary-fixed px-10 py-7 rounded-full font-bold text-xl shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                Start Hiring Now
              </Button>
              <button className="w-full md:w-auto text-on-surface px-12 py-5 rounded-full font-bold text-xl hover:bg-surface-container-highest transition-colors">
                Book Enterprise Demo
              </button>
            </div>
            <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50 flex-wrap">
              <span className="font-headline font-bold text-lg">TECH CORP</span>
              <span className="font-headline font-bold text-lg">STARK INDUSTRIES</span>
              <span className="font-headline font-bold text-lg">CYBERDYNE</span>
              <span className="font-headline font-bold text-lg">OSCORP</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#000000] w-full py-12 px-8 border-t border-[#494847]/15 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="flex">
            <div className="flex items-center font-bold text-[#D946EF] text-xl whitespace-nowrap">
              <div>Interview</div>
              <span>Fold</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-sm uppercase tracking-widest">
            <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Terms</a>
            <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Security</a>
            <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Contact</a>
          </div>
          <div className="text-[#D946EF] font-body text-sm uppercase tracking-widest text-center md:text-right">© 2026 InterviewFold. The Future of Hiring.</div>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md glass-panel text-white border-outline-variant/20 rounded-2xl shadow-2xl p-0 overflow-hidden">
          <div className="relative p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-headline font-bold text-center text-white tracking-tight">
                Sign in to <span className="text-primary">InterviewFold</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="dark flex flex-col gap-6">
              <div>
                <Label htmlFor="role" value="Role" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <Select
                  id="role"
                  {...register("role", { required: "Role is required" })}
                  className="bg-surface-container-high/50"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="hr">Recruiter</option>
                </Select>
                {errors?.role && <span className="text-error text-[10px] mt-1 block pl-1">{errors?.role?.message}</span>}
              </div>

              <div>
                <Label htmlFor="email" value="Email Address" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("usernameOrEmail", { required: "Email is required" })}
                  className="bg-white/5"
                  required
                />
                {errors?.usernameOrEmail && <span className="text-error text-[10px] mt-1 block pl-1">{errors?.usernameOrEmail?.message}</span>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 pl-1">
                  <Label htmlFor="password" value="Password" className="font-medium text-on-surface-variant text-xs uppercase tracking-widest" />
                  <a href="#" className="text-[10px] text-primary hover:text-white transition-colors duration-300 font-bold uppercase tracking-widest">forgot Password?</a>
                </div>
                <div className="relative">
                  <TextInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: "Password is required" })}
                    className="bg-white/5 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-primary" />
                    ) : (
                      <Eye size={18} className="text-on-surface-variant" />
                    )}
                  </button>
                </div>
                {errors?.password && <span className="text-error text-[10px] mt-1 block pl-1">{errors?.password?.message}</span>}

              </div>

              {errMsg && (
                <div className="text-error text-xs text-center bg-error/10 border border-error/20 py-3 rounded-xl">
                  {errMsg}
                </div>
              )}

              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full btn-primary-gradient border-none h-14 rounded-xl text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all duration-300 active:scale-95"
                >
                  Sign In to Platform
                </Button>
              </div>
            </form>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        </DialogContent>
      </Dialog>
      {/* Register Dialog */}
      <Dialog open={openRegisterModal} onOpenChange={setOpenRegisterModal}>
        <DialogContent className="max-w-xl glass-panel text-white border-outline-variant/20 rounded-2xl shadow-2xl p-0 overflow-hidden">
          <div className="relative p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-headline font-bold text-center text-white tracking-tight">
                Create your <span className="text-primary">Enterprise</span> Profile
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleRegisterSubmit(onRegister)} className="dark grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <Label htmlFor="firstName" value="First Name" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <TextInput
                  id="firstName"
                  placeholder="John"
                  {...registerUser("firstName", { required: "First name is required" })}
                  className="bg-white/5"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <Label htmlFor="lastName" value="Last Name" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <TextInput
                  id="lastName"
                  placeholder="Doe"
                  {...registerUser("lastName", { required: "Last name is required" })}
                  className="bg-white/5"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <Label htmlFor="username" value="Username" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <TextInput
                  id="username"
                  placeholder="johndoe123"
                  {...registerUser("username", { required: "Username is required" })}
                  className="bg-white/5"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <Label htmlFor="companyName" value="Company Name" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <TextInput
                  id="companyName"
                  placeholder="Inc Corp"
                  {...registerUser("companyName", { required: "Company is required" })}
                  className="bg-white/5"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="registerEmail" value="Corporate Email" className="mb-2 block font-medium text-on-surface-variant text-xs uppercase tracking-widest pl-1" />
                <TextInput
                  id="registerEmail"
                  type="email"
                  placeholder="john@company.com"
                  {...registerUser("email", { required: "Email is required" })}
                  className="bg-white/5"
                  required
                />
              </div>

              <div className="md:col-span-2 mt-4 flex flex-col gap-4">
                {errMsg && (
                  <div className="text-error text-[10px] text-center bg-error/10 border border-error/20 py-3 rounded-xl">
                    {errMsg}
                  </div>
                )}
                {regMsg && (
                  <div className="text-green-400 text-[10px] text-center bg-green-400/10 border border-green-400/20 py-3 rounded-xl">
                    {regMsg}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full btn-primary-gradient border-none h-14 rounded-xl text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all duration-300 active:scale-95"
                >
                  Create Recruiter Account
                </Button>
              </div>
            </form>
          </div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-3xl -ml-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl -mr-16 -mb-16 pointer-events-none"></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
