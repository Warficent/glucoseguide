import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { zoneFor } from "./data";

const Input = z.object({
  imageDataUrl: z.string(),
  glucose: z.number().nullable(),
});

const Schema = z.object({
  name: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  carbs: z.number(),
  rating: z.number(),
  reason: z.string(),
});

export type ScanResult = z.infer<typeof Schema>;

export const scanFood = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => Input.parse(v))
  .handler(async ({ data }): Promise<ScanResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const zone = data.glucose == null ? "unknown" : zoneFor(data.glucose);

    const guidance =
      zone === "severe-low" || zone === "low"
        ? "The user is LOW. Fast-acting carbs are ideal — rate very sugary, low-fat items HIGH (9-10), rate low-carb / high-fat / high-protein items LOW (1-3)."
        : zone === "high" || zone === "severe-high"
        ? "The user is HIGH. Low-carb, high-fiber, protein-forward items are ideal — rate those HIGH (9-10). Rate sugary / starchy items LOW (1-3)."
        : zone === "in-range"
        ? "The user is IN RANGE. Balanced foods with moderate carbs, some protein and fiber are best — rate those HIGH (8-10). Rate pure sugar or huge carb loads LOWER."
        : "No glucose reading is available. Rate the food's overall friendliness for a Type 1 diabetic assuming a normal in-range reading.";

    const prompt = `You are a Type 1 diabetes nutrition assistant. A user photographed a food.
Identify the food, estimate carbohydrates in grams for a typical serving, and rate 1–10 how safe/appropriate it is to eat RIGHT NOW.

Current glucose: ${data.glucose == null ? "not provided" : `${data.glucose} mg/dL (${zone})`}
${guidance}

Return JSON with:
- name: short food name
- confidence: your confidence identifying the food (low | medium | high)
- carbs: estimated grams of carbs in a typical serving
- rating: integer 1-10 (10 = ideal to eat now, 1 = avoid)
- reason: one sentence explaining the rating tied to the user's glucose situation.`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: Schema }),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image", image: data.imageDataUrl },
            ],
          },
        ],
      });
      const rating = Math.max(1, Math.min(10, Math.round(output.rating)));
      const carbs = Math.max(0, Math.round(output.carbs));
      return { ...output, rating, carbs };
    } catch (err) {
      if (NoObjectGeneratedError.isInstance(err)) {
        try {
          const parsed = JSON.parse(err.text ?? "{}");
          return Schema.parse(parsed);
        } catch {}
      }
      throw err;
    }
  });
