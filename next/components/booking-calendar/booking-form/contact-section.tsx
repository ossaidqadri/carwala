import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactSectionProps<T extends FieldValues> {
  control: Control<T>;
}

export const ContactSection = <T extends FieldValues>({ control }: ContactSectionProps<T>) => {
  return (
    <div className="space-y-4">
      <Label className="font-medium text-foreground uppercase">
        Your Details
      </Label>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Name Field */}
        <FormField
          control={control}
          name={'name' as Path<T>}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your full name"
                  {...field}
                  className="h-12 bg-muted text-foreground border-border focus-visible:border-blue-500 focus-visible:ring-blue-500/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={control}
          name={'email' as Path<T>}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...field}
                  className="h-12 bg-muted text-foreground border-border focus-visible:border-blue-500 focus-visible:ring-blue-500/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Message/Notes Field */}
      <FormField
        control={control}
        name={'notes' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Tell us about your vehicle (make, model, year) and any specific concerns..."
                {...field}
                rows={5}
                className="h-36 resize-none bg-muted text-foreground border-border focus-visible:border-blue-500 focus-visible:ring-blue-500/50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};