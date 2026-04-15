import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/aiChatbot.css";

const QUESTIONS = [
  {
    key: "homeType",
    text: "What type of home do you live in?",
    options: ["Apartment", "House", "Farm"],
  },
  {
    key: "outdoorSpace",
    text: "Do you have outdoor space (yard, garden)?",
    options: ["Yes", "No"],
  },
  {
    key: "activityLevel",
    text: "How would you describe your activity level?",
    options: ["Low", "Moderate", "High"],
  },
  {
    key: "petExperience",
    text: "What is your experience with pets?",
    options: ["None", "Some", "Experienced"],
  },
  {
    key: "preferredSpecies",
    text: "Do you have a preferred species?",
    options: ["Dog", "Cat", "Bird", "Other", "No Preference"],
  },
  {
    key: "householdMembers",
    text: "Who lives in your household?",
    options: [
      "Just me",
      "With partner",
      "With children",
      "With elderly",
      "With other pets",
    ],
  },
];

export default function AIChatbot() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchMessage, setMatchMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleOpen = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Log in to find your perfect match.");
      navigate("/login");
      return;
    }

    setIsOpen(true);

    if (messages.length === 0) {
      setMessages([
        {
          type: "ai",
          text: "Hi there! 🐾 I'm your AI adoption match assistant. Let me ask you a few questions to find the perfect companion for you!",
        },
        {
          type: "ai",
          text: QUESTIONS[0].text,
        },
      ]);
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleAnswer = async (answer) => {
    const question = QUESTIONS[currentStep];

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: answer }]);

    const updatedAnswers = { ...answers, [question.key]: answer };
    setAnswers(updatedAnswers);

    const nextStep = currentStep + 1;

    if (nextStep < QUESTIONS.length) {
      // Ask next question
      setCurrentStep(nextStep);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: QUESTIONS[nextStep].text },
        ]);
      }, 500);
    } else {
      // All questions answered — get matches
      setCompleted(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "Great! Let me analyze your preferences and find the best matches... 🔍",
          },
        ]);
      }, 400);

      await fetchMatches(updatedAnswers);
    }
  };

  const fetchMatches = async (preferences) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://pawtrackerserverkevin.onrender.com/api/ai/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error("AI service unavailable");
      }

      const data = await response.json();
      setMatches(data.matches || []);
      setMatchMessage(data.message || "");

      if (data.matches && data.matches.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: `I found ${data.matches.length} great match${data.matches.length > 1 ? "es" : ""} for you! 🎉`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: data.message || "No matches found. Try broadening your preferences!",
          },
        ]);
      }
    } catch {
      setError(
        "Our AI assistant is taking a break. Please browse pets manually."
      );
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, I'm having trouble connecting right now. You can browse available pets directly!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setMessages([
      {
        type: "ai",
        text: "Let's start fresh! 🐾",
      },
      {
        type: "ai",
        text: QUESTIONS[0].text,
      },
    ]);
    setMatches([]);
    setMatchMessage("");
    setError("");
    setCompleted(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="ai-chatbot-fab"
        onClick={handleOpen}
        title="Find My Match"
        id="ai-chatbot-trigger"
      >
        🐾
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={`ai-chatbot-panel ${theme}`}>
          {/* Header */}
          <div className="chatbot-header">
            <h3>🤖 Pet Match Assistant</h3>
            <button className="close-btn" onClick={handleClose}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Options (only show when NOT completed and NOT loading) */}
          {!completed && !loading && currentStep < QUESTIONS.length && (
            <div className="chat-options">
              {QUESTIONS[currentStep].options.map((opt) => (
                <button
                  key={opt}
                  className="chat-option-btn"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Match Cards */}
          {matches.length > 0 && (
            <div className="match-cards">
              {matches.map((match, i) => (
                <div key={i} className="match-card">
                  <div className="match-card-header">
                    <h4>{match.animal?.name}</h4>
                    <span className="match-score">
                      {match.compatibilityScore}%
                    </span>
                  </div>
                  <div className="match-card-details">
                    {match.animal?.species} · {match.animal?.breed || "Mixed"} ·{" "}
                    {match.animal?.age
                      ? `${match.animal.age} yrs`
                      : "Age unknown"}{" "}
                    · {match.animal?.sex}
                  </div>
                  <div className="match-card-note">
                    {match.compatibilityNote}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error fallback */}
          {error && (
            <div style={{ padding: "0 16px 16px" }}>
              <div className="ai-error">
                {error}{" "}
                <a href="/adoption" style={{ color: "#667eea" }}>
                  Browse pets →
                </a>
              </div>
            </div>
          )}

          {/* Reset button */}
          {completed && !loading && (
            <div style={{ padding: "0 16px 16px" }}>
              <button
                className="ai-generate-btn"
                onClick={handleReset}
                style={{ width: "100%" }}
              >
                🔄 Start Over
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
