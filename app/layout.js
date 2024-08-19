'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { createTheme, ThemeProvider } from "@mui/material";
import getLPTheme from "./theme";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mode, setMode] = React.useState('light');
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  return (
    <>
    <ClerkProvider>
      <ThemeProvider theme={defaultTheme}>
        <html lang="en">
          <head>
            <title>Flash Forward</title>
          </head>
          <body className={inter.className}>{children}</body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
    </>
  );
}
