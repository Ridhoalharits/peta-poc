import { notFound } from "next/navigation";
import { PageMain } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ToastOnMount } from "@/components/shared/toast-on-mount";
import { TalentProfile, type ProfileDialog } from "@/components/talent-management/talent-profile";
import { getTalent } from "@/lib/data/talent-management";
import { param } from "@/lib/demo";

const PROFILE_DIALOGS: readonly ProfileDialog[] = ["edit", "delete"];

// Blocking route (Cache Components): params are read before rendering, so unknown ids get a real 404.
export const instant = false;

export default async function TalentProfilePage({ params, searchParams }: PageProps<"/talent-management/[id]">) {
  const { id } = await params;
  const talent = getTalent(id);
  if (!talent) notFound();

  const sp = await searchParams;
  const initialDialog = PROFILE_DIALOGS.find((dialog) => dialog === param(sp, "open"));

  return (
    <>
      <PageHeader items={[{ label: "Talent Management", href: "/talent-management" }, { label: talent.fullName }]} />
      <PageMain>
        <TalentProfile initialTalent={talent} initialDialog={initialDialog} />
        {param(sp, "toast") === "saved" && (
          <ToastOnMount title="Changes saved" description={`${talent.fullName}'s details were updated.`} />
        )}
      </PageMain>
    </>
  );
}
