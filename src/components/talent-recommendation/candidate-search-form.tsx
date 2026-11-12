"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { FormAlert } from "@/components/shared/form-alert";
import { SwitchCard } from "@/components/shared/form/switch-card";
import { SectionCard } from "@/components/shared/section-card";
import {
  criteriaFormResolver,
  formAlertMessage,
  toCriteria,
  toFormValues,
  type CriteriaFormInput,
  type CriteriaFormOutput,
} from "@/lib/criteria-form";
import { rerunSearch, startSearch } from "@/lib/data";
import type { SearchCriteria } from "@/lib/types";
import { weightsTotal } from "@/lib/weights";
import { EducationGroup } from "./criteria-form/education-group";
import { EmploymentGroup } from "./criteria-form/employment-group";
import { FormActions } from "./criteria-form/form-actions";
import { PreferencesGroup } from "./criteria-form/preferences-group";
import { VacancyCard } from "./criteria-form/vacancy-card";
import { ScoringWeights } from "./scoring-weights";

const LIST_HREF = "/talent-recommendation";
const UNTITLED_DRAFT = "Untitled search";
const FORM_ALERT_ID = "candidate-search-alert";

function scrollToFormAlert() {
  requestAnimationFrame(() =>
    document.getElementById(FORM_ALERT_ID)?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
}

interface CandidateSearchFormProps {
  initial: SearchCriteria;
  /** "edit" re-runs `searchId` and opens its processing view; "new" starts a new search. */
  mode: "new" | "edit";
  searchId?: string;
  cancelHref: string;
  /** ?state=errors: open with the validation errors already shown (TR-02a). */
  showErrorsOnMount?: boolean;
}

export function CandidateSearchForm({ initial, mode, searchId, cancelHref, showErrorsOnMount = false }: CandidateSearchFormProps) {
  const router = useRouter();
  const form = useForm<CriteriaFormInput, unknown, CriteriaFormOutput>({
    defaultValues: toFormValues(initial),
    resolver: criteriaFormResolver,
    shouldFocusError: false,
  });
  const { errors } = form.formState;
  const advancedMode = useWatch({ control: form.control, name: "advancedMode" });
  const weights = useWatch({ control: form.control, name: "weights" });
  const include = useWatch({ control: form.control, name: "include" });
  const total = weightsTotal(weights, include);
  const { isSubmitted } = form.formState;

  // The weights rule spans several fields, so field-level re-validation misses it: re-check it after a submit attempt.
  useEffect(() => {
    if (isSubmitted) void form.trigger("weights");
  }, [form, isSubmitted, total, advancedMode]);

  const submitSearch = (values: CriteriaFormOutput) => {
    const criteria = toCriteria(values);
    if (mode === "edit" && searchId) {
      const { id } = rerunSearch(searchId, criteria);
      router.push(`${LIST_HREF}/${id}?state=processing`);
      return;
    }
    const { id } = startSearch(criteria);
    router.push(`${LIST_HREF}/${id}`);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) =>
    void form.handleSubmit(submitSearch, scrollToFormAlert)(event);

  useEffect(() => {
    if (showErrorsOnMount) void form.handleSubmit(() => undefined)();
  }, [form, showErrorsOnMount]);

  const saveDraft = () => {
    const title = form.getValues("jobTitle").trim() || UNTITLED_DRAFT;
    router.push(`${LIST_HREF}?toast=draft-saved&title=${encodeURIComponent(title)}`);
  };

  const alertProblems = {
    missingTitle: Boolean(errors.jobTitle),
    missingDescription: Boolean(errors.jobDescription),
    weightsInvalid: Boolean(errors.weights),
  };
  const showAlert = Object.values(alertProblems).some(Boolean);

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={onSubmit} className="flex max-w-[960px] flex-col gap-6">
        {showAlert && (
          <div id={FORM_ALERT_ID} className="scroll-mt-6">
            <FormAlert title="The search can't start yet">{formAlertMessage(alertProblems)}</FormAlert>
          </div>
        )}
        <VacancyCard />
        <SectionCard title="Requirements" description="Uncheck a requirement to leave it out of the search.">
          <EducationGroup />
          <Separator />
          <EmploymentGroup />
          <Separator />
          <PreferencesGroup />
        </SectionCard>
        <SwitchCard
          id="advanced-mode"
          title="Advanced mode"
          description="Set how much each parameter counts toward the match score."
          checked={advancedMode}
          onCheckedChange={(checked) => form.setValue("advancedMode", checked, { shouldDirty: true })}
        >
          <ScoringWeights />
        </SwitchCard>
        <FormActions cancelHref={cancelHref} onSaveDraft={saveDraft} />
      </form>
    </FormProvider>
  );
}
