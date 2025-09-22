// src/components/hospitals/ui/add-new-hospital/tabs/ContactTab.tsx

'use client';

import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ContactTab = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("phone")} placeholder="Enter phone number" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Email Address (Optional)</FormLabel>
                <FormControl>
                    <Input type="email" {...register("email")} placeholder="Enter email address" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Emergency Phone (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("emergencyPhone")} placeholder="Enter emergency phone" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Emergency Email (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("emergencyEmail")} placeholder="Enter emergency email" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </div>
    </div>
  );
};

export default ContactTab;
