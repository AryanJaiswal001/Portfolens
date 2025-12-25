import PrivateLayout from "./PrivateLayout";
import InsightsResults from "./Insights_page_components/InsightsResults";

export default function InsightsPage() {
  return (
    <PrivateLayout pageTitle="Insights">
      <InsightsResults />
    </PrivateLayout>
  );
}
