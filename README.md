# Foras Khadra - Opportunity Assistant

A smart assistant for the [Foras Khadra](https://www.foraskhadra.com) platform that helps users find relevant opportunities, scholarships, and programs through a conversational interface.

## About

Foras Khadra publishes 800+ opportunities and scholarships, serving over 1 million monthly visitors. This assistant uses a RAG (Retrieval-Augmented Generation) approach — it feeds a curated database of opportunities into Groq's Llama 3 model as context, allowing users to ask natural language questions in Arabic and get relevant, grounded answers.

## How It Works

1. **Opportunity Database**: A structured dataset of 15 opportunities (scholarships, internships, competitions, volunteer programs) stored in `app/data/opportunities.js`
2. **RAG Context Injection**: When a user sends a message, the API route formats all opportunity data into a structured prompt and sends it to Groq as system context
3. **Groq API**: The `llama3-8b-8192` model processes the user's question against the opportunity context and generates a relevant Arabic response
4. **Chat Interface**: A simple RTL Arabic chat UI built with Next.js

```
User Question → API Route → [Opportunity Data + Question] → Groq (Llama 3) → Response
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI Model**: Llama 3 via Groq SDK
- **Language**: JavaScript
- **Deployment**: Vercel
