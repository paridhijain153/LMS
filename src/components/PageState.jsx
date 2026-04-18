import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import "@/styles/components/page-state.css";

const iconByType = {
  loading: Loader2,
  empty: Inbox,
  error: AlertCircle,
};

export function PageState({ type = "empty", title, description, action, icon: CustomIcon }) {
  const Icon = CustomIcon || iconByType[type] || Inbox;

  return (
    <section className={`page-state page-state--${type}`}>
      <div className="page-state__icon-wrap">
        <Icon className={type === "loading" ? "page-state__icon page-state__icon--spin" : "page-state__icon"} />
      </div>
      <h3 className="page-state__title">{title}</h3>
      {description ? <p className="page-state__description">{description}</p> : null}
      {action ? <div className="page-state__action">{action}</div> : null}
    </section>
  );
}
