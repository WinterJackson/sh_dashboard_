// src/components/hospitals/ui/add-new-hospital/tabs/LocationTab.tsx

'use client';

import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const LocationTab = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormItem>
                <FormLabel>County</FormLabel>
                <FormControl>
                    <Input {...register("county")} placeholder="Enter county" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Sub-County (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("subCounty")} placeholder="Enter sub-county" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Ward (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("ward")} placeholder="Enter ward" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Town (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("town")} placeholder="Enter town" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Street Address (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("streetAddress")} placeholder="Enter street address" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Plot Number (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("plotNumber")} placeholder="Enter plot number" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Nearest Landmark (Optional)</FormLabel>
                <FormControl>
                    <Input {...register("nearestLandmark")} placeholder="Enter nearest landmark" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Latitude (Optional)</FormLabel>
                <FormControl>
                    <Input type="number" step="any" {...register("latitude")} placeholder="Enter latitude" />
                </FormControl>
                <FormMessage />
            </FormItem>
            <FormItem>
                <FormLabel>Longitude (Optional)</FormLabel>
                <FormControl>
                    <Input type="number" step="any" {...register("longitude")} placeholder="Enter longitude" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </div>
    </div>
  );
};

export default LocationTab;
