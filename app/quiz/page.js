"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, doc, getDocs } from "firebase/firestore";
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Container, Typography, Radio, FormControlLabel, FormControl, FormLabel, Button, Box } from "@mui/material";

const generateOptions = (correctAnswer, allAnswers, numOptions = 4) => {
  const options = [correctAnswer];
  while (options.length < numOptions) {
    const randomIndex = Math.floor(Math.random() * allAnswers.length);
    const wrongAnswer = allAnswers[randomIndex];
    if (!options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  return options.sort(() => Math.random() - 0.5); 
};

export default function QuizPage() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    if (!search || !user) return;

    async function getFlashcards() {
      try {
        setLoading(true);
        const colRef = collection(db, "users", user.id, "flashcardSets");
        const docs = await getDocs(colRef);
        const flashcardsArray = [];
        docs.forEach((doc) => {
          if (doc.id === search) {
            flashcardsArray.push(...Object.values(doc.data().flashcards || {}));
          }
        });

        if (flashcardsArray.length === 0) {
          console.error("No flashcards found for the provided ID.");
        } else {
          console.log("Fetched flashcards:", flashcardsArray);
          setFlashcards(flashcardsArray);
          generateQuiz(flashcardsArray);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    }

    const generateQuiz = (flashcardsArray) => {
      const questions = flashcardsArray
        .sort(() => Math.random() - 0.5) 
        .slice(0, 10) 
        .map(flashcard => {
          const correctAnswer = flashcard.back;
          const wrongAnswers = flashcardsArray
            .filter(f => f.back !== correctAnswer)
            .map(f => f.back);
          const options = generateOptions(correctAnswer, wrongAnswers);

          return {
            question: flashcard.front,
            options,
            answer: correctAnswer,
          };
        });

      console.log("Generated questions:", questions);
      setQuestions(questions);
    };

    getFlashcards();
  }, [search, user]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (quizCompleted) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Quiz Completed!
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Your score: {score} / {questions.length}
        </Typography>
        <Button variant="contained" onClick={() => router.push('/flashcards')}>
          Back to Flashcards
        </Button>
      </Container>
    );
  }

  if (questions.length === 0) {
    return <div>No questions available. Please try again later.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
     <Suspense>
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {currentQuestion.question}
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select an answer:</FormLabel>
        {currentQuestion.options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Radio
                checked={selectedAnswer === option}
                onChange={handleAnswerChange}
                value={option}
              />
            }
            label={option}
          />
        ))}
      </FormControl>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          disabled={selectedAnswer === ''}
        >
          {currentQuestionIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
        </Button>
      </Box>
    </Container>
    </Suspense>
    </>
  );
}