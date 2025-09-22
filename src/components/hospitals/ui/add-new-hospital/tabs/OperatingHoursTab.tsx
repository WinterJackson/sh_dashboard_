// src/components/hospitals/ui/add-new-hospital/tabs/OperatingHoursTab.tsx

'use client';

import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const OperatingHoursTab = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormItem>
                <FormLabel>Open 24 Hours? (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("open24Hours")} placeholder="Yes/No" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Open Weekends? (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("openWeekends")} placeholder="Yes/No" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Operating Hours (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("operatingHours")} placeholder="e.g., 24/7 or Mon-Fri 9am-5pm" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </div>
    </div>
  );
};

export default OperatingHoursTab;
