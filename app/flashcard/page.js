"use client";
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { collection, doc, getDocs } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  //console.log(search)

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      console.log(db);
      const colRef = collection(db, "users", user.id, "flashcardSets");
      console.log("this is colRef", colRef);

      const docs = await getDocs(colRef);
      console.log("this is docs", docs);

      const flashcards = [];

      docs.forEach((doc) => {
        //this isn't running
        if (doc.id === search) {
          console.log(doc.id, search, "matches");
          console.log("this is the data", doc.data());
          const flashcardsArray = Object.values(doc.data().flashcards || {});
          flashcards.push(...flashcardsArray);
        }
      });

      console.log("this is flashcards", flashcards);
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [search, user]);

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
    </Container>
  );
}