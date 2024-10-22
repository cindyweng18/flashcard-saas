'use client'
import  getStripe from "../utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, ButtonGroup, Card, CardActions, CardContent, Container, Divider, Grid, Stack, TextField, Toolbar, Typography } from "@mui/material";
import NavBar from "./navbar";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const handleSubmit = async (subscriptionType) => {
  const checkoutSession = await fetch('/api/checkout_sessions', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
    body: JSON.stringify({subscriptionType})
  })
  const checkoutSessionJson = await checkoutSession.json()

  const stripe = await getStripe()
  const {error} = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  })

  if (error) {
    console.warn(error.message)
  }
}

export default function Home() {
  return (
    <>
      <NavBar />
      <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            Flash 
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
               Forward
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Get ahead on your future with AI flashcards.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button variant="contained" color="primary" href="/generate">
              Get Started
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
      <Container
      id="features"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '100%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary" gutterBottom> Features </Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                p: 1,
              }}
              >
                <CardContent>
                  <Typography color="text.primary" variant="body2" fontWeight="bold">Smart Flashcard Generation</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Leverage AI to automatically create flashcards tailored to your learning pace and style, ensuring that you focus on the most important concepts for your college prep.
                  </Typography>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                p: 1,
              }}
              >
                <CardContent>
                  <Typography color="text.primary" variant="body2" fontWeight="bold">Interactive Study Tools</Typography>
                  <Typography variant="body2" color="text.secondary">
                  Engage with dynamic study modes, including quizzes, memory games, and spaced repetition, designed to reinforce learning and help you retain information more effectively.
                  </Typography>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                p: 1,
              }}
              >
                <CardContent>
                  <Typography color="text.primary" variant="body2" fontWeight="bold">Personalized Learning Insights</Typography>
                  <Typography variant="body2" color="text.secondary">
                  Track your progress with detailed analytics and receive personalized recommendations to strengthen weak areas, giving you a clear path to academic success.
                  </Typography>
                </CardContent>
              </Card>
          </Grid>
        </Grid>
      </Box>
      </Container>

      <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
      >
        <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
        >
          <Typography component="h2" variant="h4" color="text.primary">
            Pricing
          </Typography>
        </Box>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: '1px solid',
                borderColor: 'primary.main',
                background: 'linear-gradient(#033363, #021F3B)'
              }}
              >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'grey.100',
                  }}
                >
                  <Typography component="h3" variant="h6">Basic Plan</Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'baseline', color: 'grey.50'}}>
                  <Typography component="h3" variant="h2">$0</Typography>
                  <Typography component="h3" variant="h6">&nbsp; per month</Typography>
                </Box>
                <Divider sx={{my: 2, opacity: 0.2, borderColor: 'grey.500',}}/>
                <Box sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center', }}>
                    <CheckCircleRoundedIcon sx={{width: 20, color: 'primary.light'}}/>
                      <Typography component="text" variant="subtitle2" sx={{ color:'grey.200'}}>
                      Access a limited number of flashcards per month generated by our AI.
                    </Typography>
                  </Box>
                  <Box sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center', }}>
                    <CheckCircleRoundedIcon sx={{width: 20, color: 'primary.light'}}/>
                    <Typography component="text" variant="subtitle2" sx={{ color:'grey.200'}}>
                      Study with flashcards for essential subjects like Math, Science, and English.
                    </Typography>
                    </Box>
                    <Box sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center', }}>
                    <CheckCircleRoundedIcon sx={{width: 20, color: 'primary.light'}}/>
                    <Typography component="text" variant="subtitle2" sx={{ color:'grey.200'}}>
                    Monitor your learning progress with basic analytics.
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    component="a"
                    variant="contained"
                    onClick={() => handleSubmit('basic')}>
                    Choose Basic
                  </Button>
              </CardActions>
              </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: '1px solid',
                borderColor: 'primary.main',
                background: 'linear-gradient(#033363, #021F3B)'
              }}
              >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'grey.100',
                  }}
                >
                  <Typography component="h3" variant="h6">Pro Plan</Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'baseline', color: 'grey.50'}}>
                  <Typography component="h3" variant="h2">$2</Typography>
                  <Typography component="h3" variant="h6">&nbsp; per month</Typography>
                </Box>
                <Divider sx={{my: 2, opacity: 0.2, borderColor: 'grey.500',}}/>
                <Box sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center', }}>
                    <CheckCircleRoundedIcon sx={{width: 20, color: 'primary.light'}}/>
                      <Typography component="text" variant="subtitle2" sx={{ color:'grey.200'}}>
                      Create and use an unlimited number of AI-generated flashcards
                    </Typography>
                  </Box>
                  <Box sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center', }}>
                    <CheckCircleRoundedIcon sx={{width: 20, color: 'primary.light'}}/>
                    <Typography component="text" variant="subtitle2" sx={{ color:'grey.200'}}>
                    Get access to all subjects, including advanced topics and elective courses.
                    </Typography>
                    </Box>
                    <Box sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center', }}>
                    <CheckCircleRoundedIcon sx={{width: 20, color: 'primary.light'}}/>
                    <Typography component="text" variant="subtitle2" sx={{ color:'grey.200'}}>
                    Create your own flashcards and use additional study tools like memory games and quizzes.
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    component="a"
                    variant="contained"
                    onClick={() => handleSubmit('pro')}>
                    Choose Pro
                  </Button>
              </CardActions>
              </Card>
          </Grid>
        </Grid>
      </Container>
      <Divider />
      </>
      );
}
