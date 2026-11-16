import { SolidBadge } from "@/components/shared/solid-badge";
import { SectionCard } from "@/components/shared/section-card";
import type { Talent } from "@/lib/data/talent-management";
import { formatDate, formatServiceShort } from "@/lib/format";

const EMPTY_VALUE = "—";

interface DetailItem {
  label: string;
  value: string | number;
}

/** A titled card holding a 2-column description list (DESIGN-SYSTEM §11.9). */
function DetailCard({ title, items }: { title: string; items: DetailItem[] }) {
  return (
    <SectionCard title={title}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
            <dd className="text-sm font-medium">{item.value === "" ? EMPTY_VALUE : item.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}

const dateOrEmpty = (iso: string) => (iso ? formatDate(iso) : "");

/** Name, "position · group · location" and the neutral profile tags. Actions go on the right. */
export function TalentSummary({ talent, actions }: { talent: Talent; actions: React.ReactNode }) {
  const subtitle = [talent.position, talent.jobFamilyGroup, talent.location].filter(Boolean).join(" · ");
  return (
    <SectionCard contentClassName="flex-row items-center justify-between gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{talent.fullName}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <SolidBadge tone="neutral">{talent.level}</SolidBadge>
          <SolidBadge tone="neutral">{talent.employeeType}</SolidBadge>
          <SolidBadge tone="neutral">{formatServiceShort(talent.lengthOfServiceMonths)} of service</SolidBadge>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">{actions}</div>
    </SectionCard>
  );
}

/** Employment on the left; Personal and Education stacked on the right. */
export function TalentDetailCards({ talent }: { talent: Talent }) {
  return (
    <div className="grid grid-cols-[1.6fr_1fr] items-start gap-6">
      <DetailCard
        title="Employment"
        items={[
          { label: "Employee Type", value: talent.employeeType },
          { label: "Hire Date", value: dateOrEmpty(talent.hireDate) },
          { label: "Length of Service", value: `${talent.lengthOfServiceMonths} months` },
          { label: "Management Level", value: talent.level },
          { label: "Position", value: talent.position },
          { label: "Job Title", value: talent.jobTitle },
          { label: "Business Title", value: talent.businessTitle },
          { label: "Job Profile", value: talent.jobProfile },
          { label: "Job Family Group", value: talent.jobFamilyGroup },
          { label: "Job Family", value: talent.jobFamily },
          { label: "Location", value: talent.location },
          { label: "Work Space", value: talent.workSpace },
        ]}
      />
      <div className="flex flex-col gap-6">
        <DetailCard
          title="Personal"
          items={[
            { label: "Date of Birth", value: dateOrEmpty(talent.dob) },
            { label: "Age", value: talent.age },
            { label: "City of Birth", value: talent.cityOfBirth },
            { label: "Gender", value: talent.gender },
            { label: "Marital Status", value: talent.maritalStatus },
            { label: "Religion", value: talent.religion },
          ]}
        />
        <DetailCard
          title="Education"
          items={[
            { label: "Education", value: talent.education },
            { label: "Field of Study", value: talent.fieldOfStudy },
            { label: "Degrees", value: talent.degrees },
          ]}
        />
      </div>
    </div>
  );
}
