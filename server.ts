import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route: Health Check for Nginx & Deployment
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Route: Database Health Check
app.get("/api/db-status", async (req, res) => {
  const { pool, checkDbConnection } = await import("./server/db.js");
  const connected = await checkDbConnection();
  res.json({
    database: connected ? "connected" : "disconnected",
    type: pool ? "PostgreSQL" : "LocalStorage (Memory Fallback)"
  });
});

// Gemini AI Setup (lazy/safe initialization)
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: AI Spiritual & Abundance Insight
app.post("/api/spiritual-insight", async (req, res) => {
  try {
    const { transactions, summary, question } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback message if key is not configured
      return res.json({
        insight: `✨ **Reflexão Espiritual de Prosperidade:**

Sua circulação financeira reflete a energia do seu propósito no mundo. Ao direcionar seus recursos com clareza e gratidão, você transforma o ato de pagar contas em uma bênção contínua.

*Conselho de Abundância:*
1. **Reconheça a utilidade:** Cada serviço recebido enriqueceu sua vida antes mesmo do pagamento.
2. **Abençoe a saída:** O dinheiro que sai é energia gerando valor para outras pessoas.
3. **Celebre o que chega:** Agradeça por cada recurso recebido, pois a gratidão atrai mais prosperidade.`,
        affirmation: "Sou um canal fluido e abundante de prosperidade, paz e sabedoria em minhas escolhas."
      });
    }

    const prompt = `Você é um Mentor Espiritual de Prosperidade e Educação Financeira Consciente (linguagem acolhedora, amorosa, profunda e sem jargões contábeis complexos).
Analise o resumo financeiro consciente do usuário:
- Abundância Recebida (Receitas): R$ ${summary?.totalIncome || 0}
- Destino Consciente (Despesas): R$ ${summary?.totalExpenses || 0}
- Saldo de Abundância: R$ ${summary?.balance || 0}
- Média de Impacto no Bem-Estar: ${summary?.wellnessAverage || 5}/5
- Pergunta ou foco do usuário: "${question || 'Como posso alinhar melhor minhas escolhas financeiras com minha prosperidade espiritual e paz de espírito?'}"

Com base nisso, forneça uma resposta inspiradora em formato JSON válido contendo:
{
  "insight": "Sua reflexão espiritual acolhedora em Markdown (2 a 3 parágrafos curtos com pontos de ação consciente e gratidão)",
  "affirmation": "Uma afirmação diária de prosperidade espiritual para o usuário repetir"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        return res.json({
          insight: responseText,
          affirmation: "Minhas escolhas conscientes manifestam abundância em minha jornada."
        });
      }
    }

    return res.json({
      insight: "A verdadeira prosperidade começa com a intenção no coração ao movimentar cada recurso.",
      affirmation: "Agradeço pelo que recebo e honro o destino do que compartilho."
    });
  } catch (error) {
    console.error("Error generating spiritual insight:", error);
    res.status(500).json({
      error: "Não foi possível gerar a reflexão no momento.",
      insight: "A abundância é a atitude de gratidão no momento presente.",
      affirmation: "Eu abençoo minhas finanças e crio paz em meu dia."
    });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
