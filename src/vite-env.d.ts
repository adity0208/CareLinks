/// <reference types="vite/client" />

// Declare lucide-react module to fix TypeScript resolution
declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';

    export type LucideIcon = FC<SVGProps<SVGSVGElement>>;

    export const X: LucideIcon;
    export const Save: LucideIcon;
    export const AlertCircle: LucideIcon;
    export const Loader2: LucideIcon;
    export const CheckCircle: LucideIcon;
    export const TrendingUp: LucideIcon;
    export const TrendingDown: LucideIcon;

    // Add more icons as needed
    export const Activity: LucideIcon;
    export const Calendar: LucideIcon;
    export const Users: LucideIcon;
    export const FileText: LucideIcon;
    export const Settings: LucideIcon;
    export const LogOut: LucideIcon;
    export const Menu: LucideIcon;
    export const Search: LucideIcon;
    export const Plus: LucideIcon;
    export const Edit: LucideIcon;
    export const Trash: LucideIcon;
    export const Download: LucideIcon;
    export const Upload: LucideIcon;
    export const Eye: LucideIcon;
    export const EyeOff: LucideIcon;
    export const ChevronLeft: LucideIcon;
    export const ChevronRight: LucideIcon;
    export const ChevronDown: LucideIcon;
    export const ChevronUp: LucideIcon;
    export const Home: LucideIcon;
    export const Bell: LucideIcon;
    export const Mail: LucideIcon;
    export const Phone: LucideIcon;
    export const MapPin: LucideIcon;
    export const Clock: LucideIcon;
    export const Heart: LucideIcon;
    export const Star: LucideIcon;
    export const Info: LucideIcon;
    export const HelpCircle: LucideIcon;
    export const Check: LucideIcon;
    export const XCircle: LucideIcon;
    export const Filter: LucideIcon;
    export const SortAsc: LucideIcon;
    export const SortDesc: LucideIcon;
    export const MoreVertical: LucideIcon;
    export const MoreHorizontal: LucideIcon;

    // Chat and messaging icons
    export const Send: LucideIcon;
    export const Bot: LucideIcon;
    export const User: LucideIcon;
    export const Sparkles: LucideIcon;
    export const MessageSquare: LucideIcon;
    export const Key: LucideIcon;
    export const ExternalLink: LucideIcon;
    export const Shield: LucideIcon;
    export const Zap: LucideIcon;

    // Medical and health icons
    export const AlertTriangle: LucideIcon;
    export const Thermometer: LucideIcon;
}

