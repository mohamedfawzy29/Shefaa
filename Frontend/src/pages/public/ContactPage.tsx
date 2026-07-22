import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-gradient-to-br from-[#0F172A] via-[#1e2d48] to-[#0F172A] !pt-20 !pb-16 text-center">
                <div className="max-w-3xl mx-auto !px-6">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 !mb-6 mx-auto">
                        <MessageSquare className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white !mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Have a question, feedback, or need assistance? We're here to help you 24/7.
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto !px-6 !py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 shadow-sm flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Email Us</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 !mt-1">Our team replies within 2 hours</p>
                                <a href="mailto:support@shefaa.eg" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline !mt-2 block">
                                    support@shefaa.eg
                                </a>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 shadow-sm flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Call Us</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 !mt-1">Mon-Sun from 8am to 10pm</p>
                                <a href="tel:+201000000000" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline !mt-2 block">
                                    +20 100 000 0000
                                </a>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 shadow-sm flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Office Location</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 !mt-1">Headquarters</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 !mt-2">
                                    New Cairo, Cairo, Egypt
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 shadow-sm flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Working Hours</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 !mt-1">Customer Support</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 !mt-2">
                                    24/7 Live Support
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 !mb-2">Send us a message</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 !mb-6">Fill out the form below and we will get back to you as soon as possible.</p>

                        {submitted ? (
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl !p-8 text-center space-y-3">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Message Sent!</h3>
                                <p className="text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                                    Thank you for reaching out. A representative will contact you shortly.
                                </p>
                                <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="!mt-4">
                                    Send another message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Your Name" required placeholder="John Doe" />
                                    <Input label="Email Address" type="email" required placeholder="john@example.com" />
                                </div>
                                <Input label="Subject" required placeholder="How can we help you?" />
                                <Textarea label="Message" required rows={5} placeholder="Write your message here…" />
                                <div className="flex justify-end !pt-2">
                                    <Button type="submit" loading={loading} icon={<Send className="h-4 w-4" />}>
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
