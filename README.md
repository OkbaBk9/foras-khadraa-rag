# Foras Khadra - Opportunity Assistant

A smart assistant for the [Foras Khadra](https://www.foraskhadra.com) platform that helps users find relevant opportunities, scholarships, and programs through a conversational interface.

## About

Foras Khadra publishes 800+ opportunities and scholarships, serving over 1 million monthly visitors. This assistant uses a RAG (Retrieval-Augmented Generation) approach — it feeds a curated database of opportunities into Google's Gemini model as context, allowing users to ask natural language questions in Arabic and get relevant, grounded answers.

## How It Works

1. **Opportunity Database**: A structured dataset of 15 opportunities (scholarships, internships, competitions, volunteer programs) stored in `app/data/opportunities.js`
2. **RAG Context Injection**: When a user sends a message, the API route formats all opportunity data into a structured prompt and sends it to Gemini as system context
3. **Gemini API**: The `gemini-2.0-flash` model processes the user's question against the opportunity context and generates a relevant Arabic response
4. **Chat Interface**: A simple RTL Arabic chat UI built with Next.js

```
User Question → API Route → [Opportunity Data + Question] → Gemini → Response
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI Model**: Google Gemini 2.0 Flash via `@google/genai`
- **Language**: JavaScript
- **Deployment**: Vercel

## Setup

1. Clone the repository:
```bash
git clone https://github.com/OkbaBk9/foras-khadraa-rag.git
cd foras-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your Gemini API key:
```
GEMINI_API_KEY=your_key_here
```

You can get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
foras-assistant/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js        # API endpoint - handles Gemini requests with RAG context
│   ├── data/
│   │   └── opportunities.js    # Mock opportunity database (15 entries)
│   ├── globals.css             # Styles
│   ├── layout.js               # Root layout (RTL, Arabic metadata)
│   └── page.js                 # Chat interface
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

## Deployment

This project is configured for Vercel. To deploy:

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` as an environment variable in Vercel project settings
4. Deploy

## Live Demo

[Add your Vercel deployment URL here]
