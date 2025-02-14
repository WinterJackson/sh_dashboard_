// src/app/components/settings/toogle-button/Toogle.tsx

"use client";

import { Switch } from "@/components/ui/switch";

type ToggleProps = {
    isActive: boolean;
    onToggle: (checked: boolean) => void;
};

const Toggle = ({ isActive, onToggle }: ToggleProps) => {
    return (
        <Switch
            className="h-6 w-11 bg-slate-300"
            checked={isActive}
            onCheckedChange={onToggle}
        />
    );
};

export default Toggle;