'use client'
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import db from "@/firebase";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,

} from "@mui/material";

export default function SharedFlashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const flashcardSetId = searchParams.get("id");

  console.log("SharedFlashcards component loaded"); // Add this log

  useEffect(() => {
    async function fetchSharedFlashcards() {
      const userId = searchParams.get("user");

      
    

      console.log("flashcardSetId:", flashcardSetId); // Log the id
      console.log("userId:", userId); // Log the user

      if (!flashcardSetId || !userId) {
        console.log("Missing parameters, redirecting to 404");
        router.push("/404");
        return;
      }

      try {
        const docRef = doc(db, "users", userId, "flashcardSets", flashcardSetId);
        console.log("Fetching document at path:", docRef.path); // Log the path
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setFlashcards(docSnap.data().flashcards || []);
        } else {
          console.log("Document not found, redirecting to 404");
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching shared flashcards:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    }

    fetchSharedFlashcards();
  }, [router, searchParams]);


  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Redirect to the quiz page
  const handleTakeQuiz = (id) => {
    router.push(`/quiz?id=${id}`); 
  }


  if (loading) return <div>Loading...</div>;

  return (
      <Container maxWidth="md">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={8} md={6} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "200px",
                          position: "relative",
                          transformStyle: "preserve-3d",
                          transition: "transform 0.6s",
                          transform: flipped[index]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#aaa",
                            border: "1px solid #ccc",
                            padding: 2,
                            boxSizing: "border-box",
                          }}
                        >
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </Box>
  
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            padding: 2,
                            boxSizing: "border-box",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <Typography variant="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
         ))}
         </Grid>
         <Button variant="contained" sx={{ ml: 2 }} onClick={() => handleTakeQuiz(flashcardSetId)}>
          Take a Quiz
        </Button>
        </Container>


  );
}
