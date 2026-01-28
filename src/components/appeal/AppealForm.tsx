import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { saveAppeal, submitToWebhook } from "@/lib/appeal-storage";
import { toast } from "@/hooks/use-toast";

const appealSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be less than 16 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  discordId: z.string()
    .min(2, "Discord tag is required")
    .max(100, "Discord tag is too long"),
  email: z.string()
    .email("Please enter a valid email address"),
  banReason: z.string()
    .min(1, "Please select a ban reason"),
  appealReason: z.string()
    .min(50, "Please provide at least 50 characters explaining your appeal")
    .max(2000, "Appeal reason must be less than 2000 characters"),
});

type AppealFormValues = z.infer<typeof appealSchema>;

const banReasons = [
  { value: "hacking", label: "Hacking / Cheating" },
  { value: "toxicity", label: "Toxicity / Harassment" },
  { value: "scamming", label: "Scamming" },
  { value: "exploiting", label: "Bug Exploiting" },
  { value: "advertising", label: "Advertising" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "ban-evasion", label: "Ban Evasion" },
  { value: "other", label: "Other" },
];

export const AppealForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<AppealFormValues>({
    resolver: zodResolver(appealSchema),
    defaultValues: {
      username: "",
      discordId: "",
      email: "",
      banReason: "",
      appealReason: "",
    },
  });

  const onSubmit = async (data: AppealFormValues) => {
    setIsSubmitting(true);

    try {
      // Save to Supabase and localStorage
      const savedAppeal = await saveAppeal(data as Omit<import("@/lib/appeal-storage").AppealData, 'id' | 'submittedAt' | 'status'>);

      // Try webhook (optional, will not fail if webhook is not configured)
      await submitToWebhook(savedAppeal);

      setIsSuccess(true);
      toast({
        title: "Appeal Submitted!",
        description: "Your appeal has been submitted successfully.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting appeal:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your appeal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 rounded-full bg-emerald-100 mb-6">
          <CheckCircle className="h-16 w-16 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Appeal Submitted!</h2>
        <p className="text-gray-700 mb-8 max-w-md mx-auto">
          Thank you for submitting your appeal. Our team will review it and respond within 48-72 hours.
        </p>
        <Button 
          onClick={() => setIsSuccess(false)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Submit Another Appeal
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ban Appeal</h1>
        <p className="text-gray-700 text-lg">Submit your appeal and we'll review your case</p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-900">Minecraft Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="YourUsername" 
                      className="h-11 border-gray-300 text-gray-900"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discord & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="discordId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">Discord Tag</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="username#1234" 
                        className="h-11 border-gray-300 text-gray-900"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="h-11 border-gray-300 text-gray-900"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ban Reason */}
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-900">Ban Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select the reason for your ban" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Appeal Reason */}
            <FormField
              control={form.control}
              name="appealReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-900">Why Should We Unban You?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why you believe you should be unbanned..."
                      className="min-h-[150px] border-gray-300 text-gray-900"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-700">
                    Minimum 50 characters explaining your situation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Appeal
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="font-semibold text-emerald-900 mb-1">Fair Review</h3>
          <p className="text-sm text-emerald-800">Each appeal is reviewed fairly</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-1">Quick Response</h3>
          <p className="text-sm text-blue-800">Response within 48-72 hours</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-1">Be Honest</h3>
          <p className="text-sm text-purple-800">Honesty helps your case</p>
        </div>
      </div>
    </div>
  );
};
