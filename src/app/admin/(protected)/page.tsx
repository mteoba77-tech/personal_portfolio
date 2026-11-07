import AdminEditor from "@/components/admin/AdminEditor";
import { getContent, hasOverride } from "@/lib/content";
import { firestoreEnabled } from "@/lib/firestore";
import { CONTENT_KEYS } from "@/lib/types";

export default async function AdminPage() {
  const [profile, projects, skills] = await Promise.all([
    getContent("profile"),
    getContent("projects"),
    getContent("skills"),
  ]);
  const overrides = await Promise.all(CONTENT_KEYS.map(hasOverride));

  return (
    <AdminEditor
      initial={{ profile, projects, skills }}
      overridden={Object.fromEntries(CONTENT_KEYS.map((key, i) => [key, overrides[i]]))}
      canSave={firestoreEnabled()}
    />
  );
}
