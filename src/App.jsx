import { useState } from 'react';
import { fetchQuiz } from './api';

function shuffleOptions({ options, answerIndex, ...rest }) {
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...rest,
    options: order.map((i) => options[i]),
    answerIndex: order.indexOf(answerIndex),
  };
}

export default function App() {
  const [screen, setScreen] = useState('topic'); // topic | loading | quiz | score
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  async function startQuiz(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    setError('');
    setScreen('loading');
    try {
      const qs = await fetchQuiz(topic.trim());
      setQuestions(qs.map(shuffleOptions));
      setIndex(0);
      setSelected(null);
      setScore(0);
      setScreen('quiz');
    } catch (err) {
      setError(err.message);
      setScreen('topic');
    }
  }

  function pickAnswer(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === questions[index].answerIndex) {
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
        setSelected(null);
      } else {
        setScreen('score');
      }
    }, 800);
  }

  function playAgain() {
    setScreen('topic');
    setTopic('');
    setQuestions([]);
  }

  return (
    <main className="app">
      <h1>Quiz</h1>

      {screen === 'topic' && (
        <form onSubmit={startQuiz} className="topic-form">
          <input
            type="text"
            placeholder="Enter a topic (e.g. World War 2)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            autoFocus
          />
          <button type="submit">Start quiz</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}

      {screen === 'loading' && <p>Generating questions&hellip;</p>}

      {screen === 'quiz' && questions[index] && (
        <div className="quiz">
          <p className="progress">
            Question {index + 1} / {questions.length}
          </p>
          <h2>{questions[index].question}</h2>
          <div className="options">
            {questions[index].options.map((opt, i) => {
              const isAnswer = i === questions[index].answerIndex;
              const isPicked = i === selected;
              const revealed = selected !== null;
              const cls = revealed
                ? isAnswer
                  ? 'option correct'
                  : isPicked
                    ? 'option wrong'
                    : 'option'
                : 'option';
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  disabled={revealed}
                  onClick={() => pickAnswer(i)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {screen === 'score' && (
        <div className="score">
          <p>
            {score} / {questions.length} correct
          </p>
          <button type="button" onClick={playAgain}>
            Play again
          </button>
        </div>
      )}
    </main>
  );
}
