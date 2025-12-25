// SurveyPage.jsx
import SurveyQuestions from "./SurveyQuestions";

export default function SurveyPage() {
  return (
    <SurveyQuestions
      onComplete={(answers) => {
        console.log("Survey answers:", answers);
      }}
      onSkip={() => {
        console.log("Survey skipped");
      }}
    />
  );
}
