"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Clock, RotateCcw, Save} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useDoctorProfile} from "@/hooks/use-doctors";
import {api} from "@/lib/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({length: 12}, (_, i) => {
    const h = i + 8;
    const label = h <= 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;
    return {value: `${String(h).padStart(2, '0')}:00`, label};
});

const DAY_MAP: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
};

export default function DoctorAvailabilityPage() {
    const {data: doctor, isLoading} = useDoctorProfile();
    const queryClient = useQueryClient();

    // Track enabled slots as a Set of "day-hour" keys
    const [enabledSlots, setEnabledSlots] = useState<Set<string>>(new Set());
    const [hasChanges, setHasChanges] = useState(false);

    // Initialize from doctor profile when loaded
    useEffect(() => {
        console.log('Doctor profile loaded:', doctor);
        if (doctor?.availability) {
            console.log('Availability data:', doctor.availability);
            const slots = new Set<string>();
            doctor.availability.forEach((slot: { dayOfWeek: number; startTime: string; endTime: string }) => {
                // Parse startTime to get the hour
                const [h] = slot.startTime.split(':').map(Number);
                slots.add(`${slot.dayOfWeek}-${h}`);
            });
            console.log('Parsed slots:', Array.from(slots));
            setEnabledSlots(slots);
        }
    }, [doctor]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const availability: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
            enabledSlots.forEach(key => {
                const [dayStr, hourStr] = key.split('-');
                const dayOfWeek = parseInt(dayStr);
                const hour = parseInt(hourStr);
                const startTime = `${String(hour).padStart(2, '0')}:00`;
                const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
                availability.push({dayOfWeek, startTime, endTime});
            });
            await api.doctors.setAvailability(availability);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['doctor-profile']});
            setHasChanges(false);
        },
        onError: (error) => {
            console.error('Failed to save availability:', error);
        },
    });

    const toggleSlot = (dayIndex: number, hour: number) => {
        const key = `${dayIndex}-${hour}`;
        setEnabledSlots(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
        setHasChanges(true);
    };

    const reset = () => {
        setEnabledSlots(new Set());
        setHasChanges(true);
    };

    if (isLoading) {
        return (
            <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-10">
                <div className="h-12 w-64 rounded-xl animate-pulse bg-gray-100"/>
                <div className="grid grid-cols-7 gap-4">
                    {Array.from({length: 7}).map((_, i) => (
                        <div key={i} className="h-80 rounded-[2rem] animate-pulse bg-gray-50"/>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-brand-black tracking-tight">Availability</h1>
                    <p className="text-sm text-gray-400 font-medium">Set your weekly consultation schedule</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-12 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest gap-2"
                        onClick={reset}
                    >
                        <RotateCcw className="w-4 h-4"/>
                        Clear All
                    </Button>
                    <Button
                        variant="dark"
                        className="h-12 rounded-2xl px-8 text-[11px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-brand-dark/10"
                        onClick={() => saveMutation.mutate()}
                        disabled={!hasChanges || saveMutation.isPending}
                    >
                        <Save className="w-4 h-4"/>
                        {saveMutation.isPending ? "Saving..." : "Save Schedule"}
                    </Button>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm overflow-x-auto">
                <div className="grid grid-cols-8 gap-4 min-w-[800px]">
                    {/* Header Row */}
                    <div/>
                    {DAYS.map(day => (
                        <div key={day} className="text-center pb-4 border-b border-gray-50">
                            <span
                                className="text-[11px] font-black text-brand-dark uppercase tracking-widest">{day.slice(0, 3)}</span>
                        </div>
                    ))}

                    {/* Time Rows */}
                    {HOURS.map(({value, label}) => (
                        <div key={value} className="contents">
                            <div key={`label-${value}`} className="flex items-center justify-end pr-4">
                                <span
                                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                            </div>
                            {DAYS.map((_, dayIndex) => {
                                const hour = parseInt(value.split(':')[0]);
                                const key = `${dayIndex}-${hour}`;
                                const enabled = enabledSlots.has(key);
                                return (
                                    <motion.button
                                        key={`${value}-${dayIndex}`}
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                        onClick={() => toggleSlot(dayIndex, hour)}
                                        className={cn(
                                            "h-14 rounded-2xl border-2 transition-all duration-200",
                                            enabled
                                                ? "bg-brand-dark border-brand-dark shadow-lg shadow-brand-dark/20 text-white"
                                                : "bg-gray-50 border-gray-100 hover:border-brand-light text-gray-300"
                                        )}
                                    >
                                        {enabled && <Clock className="w-4 h-4 mx-auto"/>}
                                    </motion.button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="text-center">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Click a cell to toggle availability • Each slot is 1 hour
                </p>
            </div>
        </div>
    );
}
