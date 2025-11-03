// src/pages/InterviewPrep.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Copy, ArrowLeft, Code, User, Building, Clock } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/AnimatedBackground";
import WaveBackground from "@/components/animations/WaveBackground";
import { loadCSV, getRandomQuestions } from "@/utils/datasetLoader";

/* ---------- Helpers ---------- */
const getTwoSuggestions = (): string[] => {
  const all = [
    "Start with context — explain what you were solving.",
    "Use STAR — Situation, Task, Action, Result.",
    "Highlight measurable outcomes.",
    "Mention tools/tech you used.",
    "Finish with what you learned.",
  ];
  return [...all].sort(() => 0.5 - Math.random()).slice(0, 2);
};

const generateAIAnswer = (userInput: string, question: string): string => {
  if (!userInput || !userInput.trim()) {
    return `💡 Example: For "${question}" — briefly explain context, your role, actions you took, and the result (STAR).`;
  }
  return `✅ AI Review for "${question}":
- Good structure. Add metrics (numbers) for impact.
- Keep it concise and state what you learned.`;
};

/* ---------- Skeleton ---------- */
const SkeletonCard: React.FC = () => (
  <div className="p-4 rounded-2xl bg-white/70 shadow animate-pulse border border-gray-200">
    <div className="h-4 w-24 bg-gray-300 rounded mb-3" />
    <div className="h-4 w-full bg-gray-300 rounded mb-2" />
    <div className="h-4 w-3/4 bg-gray-300 rounded" />
  </div>
);

/* ---------- Component ---------- */
const InterviewPrep: React.FC = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Record<string, string[]>>({
    amazon: [],
    google: [],
    linkedin: [],
  });
  const [selectedTab, setSelectedTab] = useState<string>("amazon");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  const [timers, setTimers] = useState<Record<string, number>>({});
  const [isTimeUp, setIsTimeUp] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});

  const intervalsRef = useRef<Record<string, number | null>>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const load = async () => {
      setIsGenerating(true);
      try {
        // Paths -> public/datasets/*
        const [amazonRows, googleRows, linkedinRows] = await Promise.all([
          loadCSV("/datasets/amazon_clean.csv"),
          loadCSV("/datasets/google_clean.csv"),
          loadCSV("/datasets/linkedin_clean.csv"),
        ]);

        const extract = (rows: any[]) =>
          getRandomQuestions(rows || [], 10).map((q: any) =>
            typeof q === "string" ? q : q.question || q.Question || String(q)
          );

        const amazonQs = amazonRows && amazonRows.length ? extract(amazonRows) : [];
        const googleQs = googleRows && googleRows.length ? extract(googleRows) : [];
        const linkedinQs = linkedinRows && linkedinRows.length ? extract(linkedinRows) : [];

        // fallback if any is empty (keeps UI consistent)
        const fallback = (vendor: string) => {
          const samples: Record<string, string[]> = {
            amazon: [
              "How does Amazon ensure scalability during peak events like Prime Day?",
              "Explain Amazon's recommendation algorithm.",
              "How does Amazon optimize delivery routes?",
              "Describe AWS's approach to large-scale data.",
              "What is Amazon's approach to customer obsession?",
              "How does Amazon use ML for demand forecasting?",
              "How does Amazon maintain high availability?",
              "How does Amazon use automation in fulfilment centres?",
              "Describe cloud security in AWS.",
              "What metrics matter for a fulfilment centre?",
            ],
            google: [
              "How does Google rank websites in search results?",
              "Explain PageRank and how it evolved.",
              "Describe Google's approach to data privacy.",
              "How does YouTube recommend videos?",
              "What infrastructure powers Google Cloud?",
              "How does Google use AI in Photos?",
              "How does Google Maps compute routes?",
              "What principles guide Google's UX?",
              "How does Google protect user data at scale?",
              "How does Google Assistant process voice?",
            ],
            linkedin: [
              "What are LinkedIn's core values and mission?",
              "How does LinkedIn's algorithm decide what posts appear?",
              "How does LinkedIn use AI to recommend jobs?",
              "How does LinkedIn ensure data privacy?",
              "Describe LinkedIn's backend and scalability.",
              "How does LinkedIn match candidates to jobs?",
              "How does LinkedIn remove fake accounts?",
              "How does LinkedIn use data science for insights?",
              "Explain the use of Kafka in LinkedIn's systems.",
              "Difference between a connection and a follower?",
            ],
          };
          return samples[vendor];
        };

        const finalAmazon = amazonQs.length ? amazonQs : fallback("amazon");
        const finalGoogle = googleQs.length ? googleQs : fallback("google");
        const finalLinkedin = linkedinQs.length ? linkedinQs : fallback("linkedin");

        if (mountedRef.current) {
          setQuestions({ amazon: finalAmazon, google: finalGoogle, linkedin: finalLinkedin });
          console.info("[InterviewPrep] questions set:", {
            amazonCount: finalAmazon.length,
            googleCount: finalGoogle.length,
            linkedinCount: finalLinkedin.length,
          });
          setIsGenerating(false);
        }
      } catch (err) {
        console.error("Error loading datasets:", err);
        if (mountedRef.current) {
          toast.error("Failed to load datasets. Using fallback questions.");
          // fallbacks will be applied by useEffect above's fallback call
          setQuestions({
            amazon: [
              "How does Amazon ensure scalability during peak events like Prime Day?",
              "Explain Amazon's recommendation algorithm.",
              "How does Amazon optimize delivery routes?",
              "Describe AWS's approach to large-scale data.",
              "What is Amazon's approach to customer obsession?",
              "How does Amazon use ML for demand forecasting?",
              "How does Amazon maintain high availability?",
              "How does Amazon use automation in fulfilment centres?",
              "Describe cloud security in AWS.",
              "What metrics matter for a fulfilment centre?",
            ],
            google: [
              "How does Google rank websites in search results?",
              "Explain PageRank and how it evolved.",
              "Describe Google's approach to data privacy.",
              "How does YouTube recommend videos?",
              "What infrastructure powers Google Cloud?",
              "How does Google use AI in Photos?",
              "How does Google Maps compute routes?",
              "What principles guide Google's UX?",
              "How does Google protect user data at scale?",
              "How does Google Assistant process voice?",
            ],
            linkedin: [
              "What are LinkedIn's core values and mission?",
              "How does LinkedIn's algorithm decide what posts appear?",
              "How does LinkedIn use AI to recommend jobs?",
              "How does LinkedIn ensure data privacy?",
              "Describe LinkedIn's backend and scalability.",
              "How does LinkedIn match candidates to jobs?",
              "How does LinkedIn remove fake accounts?",
              "How does LinkedIn use data science for insights?",
              "Explain the use of Kafka in LinkedIn's systems.",
              "Difference between a connection and a follower?",
            ],
          });
          setIsGenerating(false);
        }
      }
    };

    load();

    return () => {
      mountedRef.current = false;
      Object.values(intervalsRef.current).forEach((id) => {
        if (id) window.clearInterval(id);
      });
    };
  }, []);

  /* ---------- Timer functions ---------- */
  const startTimerFor = (key: string, question: string) => {
    if (intervalsRef.current[key] || isTimeUp[key]) return;
    setTimers((t) => ({ ...t, [key]: t[key] ?? 60 }));

    const id = window.setInterval(() => {
      setTimers((prev) => {
        const prevVal = prev[key] ?? 60;
        const next = prevVal - 1;
        if (next <= 0) {
          if (intervalsRef.current[key]) {
            window.clearInterval(intervalsRef.current[key]!);
            intervalsRef.current[key] = null;
          }
          setIsTimeUp((s) => ({ ...s, [key]: true }));
          setRevealed((r) => ({ ...r, [key]: generateAIAnswer(answers[key] || "", question) }));
          return { ...prev, [key]: 0 };
        }
        return { ...prev, [key]: next };
      });
    }, 1000);

    intervalsRef.current[key] = id as unknown as number;
  };

  const stopTimerFor = (key: string) => {
    if (intervalsRef.current[key]) {
      window.clearInterval(intervalsRef.current[key]!);
      intervalsRef.current[key] = null;
    }
  };

  /* ---------- UI handlers ---------- */
  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Unable to copy.");
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const key = `${selectedTab}-${index}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSuggestionClick = (index: number) => {
    const key = `${selectedTab}-${index}`;
    if (isTimeUp[key]) return;

    const currentSuggestions = suggestions[key] || [];
    if (currentSuggestions.length < 2) {
      const two = getTwoSuggestions();
      setSuggestions((s) => ({ ...s, [key]: two }));
      toast.info("AI suggested 2 approaches");
      return;
    }

    setRevealed((r) => ({ ...r, [key]: generateAIAnswer(answers[key] || "", questions[selectedTab][index]) }));
    setIsTimeUp((s) => ({ ...s, [key]: true }));
    stopTimerFor(key);
    toast.success("AI answer revealed for this question");
  };

  const categories = [
    { id: "amazon", label: "Amazon", icon: User },
    { id: "google", label: "Google", icon: Code },
    { id: "linkedin", label: "LinkedIn", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="interactive" showParticles />
      <Header />

      <main className="pt-20 md:pt-28 pb-16 px-4 relative z-10">
        <WaveBackground intensity="subtle" className="top-0" />
        <div className="container mx-auto max-w-6xl relative">
          {isGenerating ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
              <p className="text-center text-muted-foreground text-sm mt-4">Loading questions...</p>
            </div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Interview Preparation</h1>
                    <p className="text-muted-foreground mt-2">Practice with real AI-powered datasets from Amazon, Google, and LinkedIn.</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/builder")} className="flex items-center gap-2 rounded-xl">
                    <ArrowLeft className="h-4 w-4" /> Back to Builder
                  </Button>
                </div>
              </motion.div>

              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid grid-cols-3 mb-6 bg-white dark:bg-card rounded-2xl p-2 shadow-sm">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat.id} value={cat.id} className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                      <cat.icon className="w-4 h-4 mr-2" />
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((cat) => (
                  <TabsContent key={cat.id} value={cat.id} className="space-y-6">
                    {questions[cat.id].length === 0 ? (
                      <p className="text-center text-muted-foreground">No questions found — check dataset or reload.</p>
                    ) : (
                      questions[cat.id].map((question, index) => {
                        const key = `${cat.id}-${index}`;
                        return (
                          <motion.div key={key} className="modern-card" whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.2 } }}>
                            <Card className="h-full relative overflow-hidden">
                              <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <Badge variant="outline" className="text-xs mb-2">Q{index + 1}</Badge>
                                    <p className="text-base font-normal text-foreground">{question}</p>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center text-sm text-gray-600 font-medium gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{timers[key] ?? 60}s</span>
                                    </div>

                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(question)}>
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent>
                                <textarea
                                  className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                  placeholder={isTimeUp[key] ? "⏳ Time’s up! Locked." : "Type your answer here..."}
                                  disabled={!!isTimeUp[key]}
                                  value={answers[key] || ""}
                                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                                  onFocus={() => startTimerFor(key, question)}
                                />

                                {suggestions[key]?.length > 0 && (
                                  <ul className="mt-3 space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">
                                    {suggestions[key].map((s, i) => <li key={i}>💡 {s}</li>)}
                                  </ul>
                                )}

                                {revealed[key] && (
                                  <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-300 text-sm text-green-800">
                                    <strong>AI Suggested Answer:</strong>
                                    <p className="mt-1 whitespace-pre-wrap">{revealed[key]}</p>
                                  </div>
                                )}
                              </CardContent>

                              <CardFooter className="flex justify-between pt-0">
                                <Button variant="outline" size="sm" onClick={() => handleSuggestionClick(index)} disabled={!!isTimeUp[key]}>
                                  <Lightbulb className="h-4 w-4 mr-2" />
                                  {suggestions[key]?.length < 2 ? "Get Suggestions" : "Reveal AI Answer"}
                                </Button>

                                <div className="flex items-center gap-3">
                                  <Button size="sm" disabled={!answers[key] || !!isTimeUp[key]} onClick={() => toast.success("Answer saved!")}>
                                    Save Answer
                                  </Button>

                                  <Button size="sm" variant="ghost" onClick={() => startTimerFor(key, question)} disabled={!!isTimeUp[key]}>
                                    Start Timer
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        );
                      })
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewPrep;
