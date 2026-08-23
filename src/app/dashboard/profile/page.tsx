import { redirect } from "next/navigation";

// /dashboard/profile and /dashboard/settings were byte-for-byte duplicate
// pages (both genuinely linked — sidebar nav uses "Settings", the
// dashboard onboarding checklist used "profile"). Consolidated onto
// /dashboard/settings as the canonical route since it's the primary nav
// item; this keeps the old URL working as a redirect rather than a 404.
export default function ProfileRedirect() {
  redirect("/dashboard/settings");
}
