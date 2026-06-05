import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Use any to avoid react-hook-form type import issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFormControl = any;

interface ContactSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}

export const ContactSection = ({ control }: ContactSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="font-medium text-foreground uppercase">
        Your Details
      </Label>

      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField
          control={control}
          name="name"
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

        <FormField
          control={control}
          name="email"
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

      <FormField
        control={control}
        name="notes"
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
