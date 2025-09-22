// src/components/hospitals/ui/add-new-hospital/tabs/OwnershipTab.tsx

'use client';

import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const OwnershipTab = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
                <FormLabel>Owner (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("owner")} placeholder="Enter owner name" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </div>
    </div>
  );
};

export default OwnershipTab;
