"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {User, Mail, Phone, Stethoscope, Briefcase, DollarSign, Calendar, Award, ShieldCheck} from "lucide-react";
import {useDoctorProfile} from "@/hooks/use-doctors";
import {api, Doctor} from "@/lib/api";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

export default function DoctorSettingsPage() {
    const {data: doctor, isLoading, refetch} = useDoctorProfile();
    const updateDoctor = api.doctors.updateMe;

    const [form, setForm] = useState<Partial<Doctor>>({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        qualifications: [],
        experience: 0,
        bio: "",
        consultationFee: 0,
    });

    const [qualificationsText, setQualificationsText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (doctor) {
            setForm({
                name: doctor.name || "",
                email: doctor.email || "",
                phone: doctor.phone || "",
                specialty: doctor.specialty || "",
                qualifications: doctor.qualifications || [],
                experience: doctor.experience ?? 0,
                bio: doctor.bio || "",
                consultationFee: doctor.consultationFee ?? 0,
            });
            setQualificationsText(doctor.qualifications?.join(", ") || "");
        }
    }, [doctor]);

    function updateField(key: keyof Doctor, value: any) {
        setForm(prev => ({...prev, [key]: value}));
    }

    async function handleSave() {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const qualifications = qualificationsText
                .split(",")
                .map(q => q.trim())
                .filter(q => q.length > 0);
            
            await updateDoctor({...form, qualifications} as any);
            await refetch();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
                <Skeleton className="h-20 w-1/2 rounded-2xl"/>
                <div className="space-y-8">
                    <Skeleton className="h-64 rounded-[2rem]"/>
                    <Skeleton className="h-48 rounded-[2rem]"/>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-brand-black tracking-tight">Settings</h1>
                <p className="text-sm text-gray-400 font-medium">Manage your professional profile and preferences</p>
            </div>

            {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-2xl text-sm font-medium">
                    Profile saved successfully!
                </div>
            )}

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="space-y-12 pb-20"
            >
                {/* Avatar Section */}
                <div className="p-10 bg-brand-light/5 rounded-[3rem] border border-brand-light/10 text-center space-y-6 relative overflow-hidden group">
                    <div className="relative inline-block">
                        <div className="w-40 h-40 rounded-[3rem] bg-white border-2 border-brand-light/20 p-2 shadow-xl shadow-brand-dark/5">
                            <div className="w-full h-full rounded-[2.5rem] bg-brand-light/20 flex items-center justify-center">
                                <User className="w-16 h-16 text-brand-light"/>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-brand-black">{form.name || "Your Name"}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Doctor Member</p>
                    </div>
                    {doctor?.isVerified && (
                        <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500"/>
                            <span className="text-xs font-bold text-emerald-600">Verified Doctor</span>
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-brand-black">Professional Information</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40"/>
                                <Input
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40"/>
                                <Input
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    type="email"
                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40"/>
                                <Input
                                    value={form.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    type="tel"
                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Specialty</label>
                            <div className="relative">
                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40"/>
                                <Input
                                    value={form.specialty}
                                    onChange={(e) => updateField("specialty", e.target.value)}
                                    placeholder="e.g., Cardiology"
                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Experience (Years)</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40"/>
                                <Input
                                    value={form.experience}
                                    onChange={(e) => updateField("experience", parseInt(e.target.value) || 0)}
                                    type="number"
                                    placeholder="e.g., 10"
                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consultation Fee ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40"/>
                                <Input
                                    value={form.consultationFee}
                                    onChange={(e) => updateField("consultationFee", parseFloat(e.target.value) || 0)}
                                    type="number"
                                    placeholder="e.g., 100"
                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Qualifications</label>
                        <div className="relative">
                            <Award className="absolute left-4 top-4 w-4 h-4 text-brand-dark opacity-40"/>
                            <Input
                                value={qualificationsText}
                                onChange={(e) => setQualificationsText(e.target.value)}
                                placeholder="MBBS, MD, MRCP (comma separated)"
                                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 px-1">Separate multiple qualifications with commas</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Bio / Professional Summary</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => updateField("bio", e.target.value)}
                            placeholder="Tell patients about your experience and approach..."
                            rows={4}
                            className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light focus:border-brand-light transition-all font-medium resize-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        variant="dark"
                        className="h-12 px-8 rounded-xl shadow-md"
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                Saving...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 px-8 rounded-xl border-gray-200"
                        onClick={() => {
                            setForm({
                                name: doctor?.name || "",
                                email: doctor?.email || "",
                                phone: doctor?.phone || "",
                                specialty: doctor?.specialty || "",
                                experience: doctor?.experience,
                                bio: doctor?.bio || "",
                                consultationFee: doctor?.consultationFee,
                            });
                            setQualificationsText(doctor?.qualifications?.join(", ") || "");
                        }}
                    >
                        Discard
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}