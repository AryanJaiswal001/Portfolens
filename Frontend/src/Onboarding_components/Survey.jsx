import PrivateLayout from "../Dashboard/PrivateLayout";
import SurveyQuestions from "../Dashboard/Dashboard_inner_components/SurveyQuestions";

export default function Survey(){
  return (
      <PrivateLayout pageTitle="Survey">
        <SurveyQuestions />
      </PrivateLayout>
    );
}