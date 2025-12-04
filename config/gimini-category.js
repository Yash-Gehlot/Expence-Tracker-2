import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const makeCategory = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      `Based on this expense description, suggest ONE category word.
      
Choose from: Travel, Fuel, Movie, Food, Shopping, Work, Health, Entertainment, Rent, Sports, Other

Description: "${prompt}"

Reply with ONLY the category word, nothing else.`
    );

    const response = result.response;
    const category = response.text().trim().toLowerCase();

    return category;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "other";
  }
};

export default makeCategory;
