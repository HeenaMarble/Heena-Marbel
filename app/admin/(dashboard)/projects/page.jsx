import { getProjectCategories } from "@/lib/actions/project-actions";
import ProjectsManager from "@/components/admin/projects/ProjectsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Heena Marble Admin",
};

export default async function AdminProjectsPage() {
  let initialCategories = [];
  try {
    initialCategories = (await getProjectCategories()) || [];
  } catch (err) {
    console.error("Failed to load project categories on server:", err);
  }

  return <ProjectsManager initialCategories={initialCategories} />;
}
