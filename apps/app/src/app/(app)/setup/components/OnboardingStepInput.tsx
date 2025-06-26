import { Input } from '@comp/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@comp/ui/select';
import { SelectPills } from '@comp/ui/select-pills';
import { Textarea } from '@comp/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CompanyDetails, Step } from '../lib/types';
import { FrameworkSelection } from './FrameworkSelection';
import { SoftwareSelection } from './SoftwareSelection';
import { WebsiteInput } from './WebsiteInput';

// Type for form fields used in this component.
// For now, defining it here to match OrganizationSetupForm.tsx structure.
export type OnboardingFormFields = Partial<CompanyDetails> & {
  [K in keyof CompanyDetails as `${K}Other`]?: string;
};

interface OnboardingStepInputProps {
  currentStep: Step;
  form: UseFormReturn<OnboardingFormFields>; // Or a more generic form type if preferred
  savedAnswers: Partial<CompanyDetails>;
  onLoadingChange?: (loading: boolean) => void;
}

export function OnboardingStepInput({
  currentStep,
  form,
  savedAnswers,
  onLoadingChange,
}: OnboardingStepInputProps) {
  if (currentStep.key === 'frameworkIds') {
    return (
      <FrameworkSelection
        value={form.getValues(currentStep.key) || []}
        onChange={(value) => form.setValue(currentStep.key, value)}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (currentStep.key === 'website') {
    return (
      <Controller
        name={currentStep.key}
        control={form.control}
        render={({ field }) => <WebsiteInput {...field} placeholder="example.com" autoFocus />}
      />
    );
  }

  if (currentStep.key === 'describe') {
    return (
      <Textarea
        {...form.register(currentStep.key)}
        placeholder={`${savedAnswers.organizationName || ''} is a company that...`}
        rows={2}
        maxLength={300}
        className="h-24 resize-none"
      />
    );
  }

  if (currentStep.key === 'software') {
    const selected = (form.watch(currentStep.key) || '').split(',').filter(Boolean);
    return (
      <SoftwareSelection
        value={selected}
        onChange={(values: string[]) => {
          form.setValue(currentStep.key, values.join(','));
        }}
      />
    );
  }

  if (currentStep.options) {
    if (currentStep.key === 'industry' || currentStep.key === 'teamSize') {
      return (
        <Select
          onValueChange={(value) => form.setValue(currentStep.key, value)}
          defaultValue={form.watch(currentStep.key)}
        >
          <SelectTrigger>
            <SelectValue placeholder={currentStep.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {currentStep.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    const options = currentStep.options.map((option) => ({
      name: option,
      value: option,
    }));
    const selected = (form.watch(currentStep.key) || '').split(',').filter(Boolean);

    return (
      <SelectPills
        data={options}
        value={selected}
        onValueChange={(values: string[]) => {
          form.setValue(currentStep.key, values.join(','));
        }}
        placeholder={`Search or add custom (press Enter) • ${currentStep.placeholder}`}
      />
    );
  }

  return (
    <Input {...form.register(currentStep.key)} placeholder={currentStep.placeholder} autoFocus />
  );
}
