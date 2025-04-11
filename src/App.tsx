
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
const Typewriter = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let isCancelled = false;
    const typeCharacter = async () => {
      for (let i = 0; i < text.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        if (!isCancelled) {
          setDisplayedText((prev) => prev + text.charAt(i));
        }
      }
    };

    setDisplayedText(""); 
    typeCharacter();
    return () => {
      isCancelled = true;
    };
  }, [text]);

  return (
    <p className="whitespace-pre-wrap text-sm md:text-base text-white">
      {displayedText}
    </p>
  );
};



const TextSummariser = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    if (!inputText.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/summarise", {
        text: inputText,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarising text:", error);
      setSummary("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center justify-center">
      <Card className="rounded-2xl shadow-xl bg-gray-900 border border-gray-700 w-full max-w-6xl">
        <CardContent className="space-y-6 flex flex-col items-center justify-center p-6">
          <motion.h1 
            className="text-8xl font-bold text-center text-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Text Summariser
          </motion.h1>
  
          <p className="text-center text-gray-400 text-sm md:text-base max-w-2xl">
            Enter your lengthy content below and let our summariser do the magic!
          </p>
  
          <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-start">
            <Textarea
              placeholder="Paste your long text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-64 resize-none rounded-xl w-full md:w-1/2 text-sm md:text-base bg-gray-800 text-gray-100 border-gray-700 placeholder:text-gray-500"
            />
  
            <div className="flex flex-col items-center justify-start space-y-4 w-full md:w-1/2">
              <div className="w-full border text-white border-gray-700 rounded-xl p-4 bg-gray-800 h-64 overflow-auto">
                {summary && <Typewriter text={summary} />}
              </div>
            </div>
            </div>
            <Button 
                onClick={handleSummarise} 
                className="w-40 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Summarising..." : "Summarise"}
              </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextSummariser;