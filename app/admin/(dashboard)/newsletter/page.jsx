import { getSubscribers } from "@/actions/newsletter";
import DeleteSubscriberButton from "@/components/admin/DeleteSubscriberButton";

export default async function NewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#b38b4d]/20 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Newsletter</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">{subscribers.length} subscribers.</p>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 overflow-hidden shadow-sm">
        {subscribers.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">No subscribers yet.</p>
        ) : (
          <ul className="divide-y divide-[#b38b4d]/10">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{s.email}</p>
                  <p className="text-xs text-[#1a1a1a]/50">{new Date(s.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <DeleteSubscriberButton id={s.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
