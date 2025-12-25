import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SURVEY_QUESTIONS = [
  {
    id: "investment_goal",
    question: "What is your primary investment goal?",
    options: [
      "Building long-term wealth",
      "Saving for retirement",
      "Generating regular income",
      "Preserving capital",
      "Funding a major purchase",
    ],
  },
  {
    id: "time_horizon",
    question: "What is your investment time horizon?",
    options: [
      "Less than 3 years",
      "3-5 years",
      "5-10 years",
      "10-20 years",
      "More than 20 years",
    ],
  },
  {
    id: "portfolio_fall_reaction",
    question: "If your portfolio dropped 15% in a month, what would you do?",
    options: [
      "Sell everything immediately",
      "Sell some investments to reduce risk",
      "Hold steady and wait",
      "Buy more while prices are lower",
      "Review and adjust strategy",
    ],
  },
  {
    id: "risk_preference",
    question: "Which statement best describes your risk preference?",
    options: [
      "I want maximum safety, even if returns are low",
      "I prefer stable returns with minimal fluctuations",
      "I accept moderate fluctuations for better returns",
      "I seek high returns and can handle volatility",
      "I maximize growth potential despite high risk",
    ],
  },
  {
    id: "inflation_understanding",
    question: "How do you think about inflation and your investments?",
    options: [
      "I don't consider inflation much",
      "I know inflation exists but unsure how it affects me",
      "I ensure returns at least match inflation",
      "I actively seek returns that beat inflation",
      "I structure my entire portfolio around inflation protection",
    ],
  },
  {
    id: "rebalancing_understanding",
    question: "How familiar are you with portfolio rebalancing?",
    options: [
      "I've never heard of it",
      "I've heard of it but don't understand it",
      "I understand the concept but haven't done it",
      "I rebalance occasionally when I remember",
      "I rebalance regularly on a set schedule",
    ],
  },
  {
    id: "market_volatility_comfort",
    question: "How comfortable are you with market volatility?",
    options: [
      "Very uncomfortable - I lose sleep over market swings",
      "Uncomfortable - I check my portfolio anxiously",
      "Neutral - I notice but don't obsess",
      "Comfortable - It's part of investing",
      "Very comfortable - I see it as opportunity",
    ],
  },
  {
    id: "investment_experience",
    question: "What best describes your investment experience?",
    options: [
      "Complete beginner - just starting out",
      "Novice - less than 2 years",
      "Intermediate - 2-5 years",
      "Experienced - 5-10 years",
      "Very experienced - more than 10 years",
    ],
  },
];

export default function SurveyQuestions({ onComplete, onSkip }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
  const totalQuestions = SURVEY_QUESTIONS.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Debug logs
  console.log("[SurveyQuestions] Component mounted");
  console.log(
    "[SurveyQuestions] Current question index:",
    currentQuestionIndex
  );
  console.log("[SurveyQuestions] Current question:", currentQuestion);
  console.log("[SurveyQuestions] Total questions:", totalQuestions);

  // Defensive guard
  if (!currentQuestion) {
    console.error("[SurveyQuestions] ERROR: currentQuestion is undefined!");
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Survey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to load survey questions. Please try again.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOption,
    };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Survey completed
      console.log("Survey completed with answers:", updatedAnswers);

      // Call custom callback if provided
      if (onComplete) {
        onComplete(updatedAnswers);
      } else {
        // Default behavior: navigate to dashboard
        navigate("/dashboard");
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(
        answers[SURVEY_QUESTIONS[currentQuestionIndex + 1]?.id] || null
      );
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(
        answers[SURVEY_QUESTIONS[currentQuestionIndex - 1].id] || null
      );
    }
  };

  const handleSkip = () => {
    console.log("Survey skipped");

    // Call custom callback if provided
    if (onSkip) {
      onSkip();
    } else {
      // Default behavior: navigate to dashboard
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Investor Profile Survey
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Help us personalize your insights and reports
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip survey
            </button>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / totalQuestions) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-6 transition-all duration-300">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedOption === option
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                      selectedOption === option
                        ? "border-blue-600 dark:border-blue-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {selectedOption === option && (
                      <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
                    )}
                  </div>
                  <span
                    className={`text-base ${
                      selectedOption === option
                        ? "text-gray-900 dark:text-gray-100 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isLastQuestion ? "Complete" : "Next"}
          </button>
        </div>

        {/* Explanation Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500 max-w-xl mx-auto">
            <strong>Why these questions?</strong> We use scenario-based
            questions to understand your real-world investment behavior. Your
            answers will help us personalize portfolio insights, risk
            assessments, and tailored recommendations in your reports.
          </p>
        </div>
      </div>
    </div>
  );
}
