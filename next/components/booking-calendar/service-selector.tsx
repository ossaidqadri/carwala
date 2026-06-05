'use client';

import { Sparkles, Droplets, Layers, HelpCircle } from 'lucide-react';
import type { ServiceOption } from './booking-widget';

interface ServiceSelectorProps {
    services: ServiceOption[];
    onSelect: (service: ServiceOption) => void;
    title?: string;
    description?: string;
}

const iconMap: Record<string, React.ReactNode> = {
    'car-wash': <Droplets className="h-6 w-6" />,
    'detailing': <Sparkles className="h-6 w-6" />,
    'both': <Layers className="h-6 w-6" />,
    'other': <HelpCircle className="h-6 w-6" />,
};

export function ServiceSelector({
    services,
    onSelect,
    title = 'Select a Service',
    description,
}: ServiceSelectorProps) {
    return (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-700 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-neutral-700">
                <h2 className="text-xl font-bold text-neutral-100">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-neutral-400">{description}</p>
                )}
            </div>

            <div className="p-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => onSelect(service)}
                        className="group flex items-start gap-4 rounded-xl border border-neutral-700 bg-neutral-800/50 p-4 text-left transition-all hover:border-blue-500/50 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-700/50 text-neutral-300 transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-400">
                            {iconMap[service.id] || <Sparkles className="h-6 w-6" />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors">
                                {service.name}
                            </h3>
                            {service.duration && (
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    {service.duration} min
                                </p>
                            )}
                            {service.description && (
                                <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                                    {service.description}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
