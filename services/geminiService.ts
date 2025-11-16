
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityPlan } from '../types';
import { allLearningOutcomes, existingThemes } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    "activityTitle": { "type": Type.STRING },
    "activitySubtitle": { "type": Type.STRING },
    "activityDescription": { "type": Type.STRING },
    "learnerDescription": { "type": Type.STRING },
    "resources": {
      "type": Type.STRING,
      "description": "A single string with each item on a new line, starting with '- ' (e.g., '- Laptop')."
    },
    "activityPlan": {
      "type": Type.STRING,
      "description": "A single string containing paragraphs or numbered steps, with a blank line between each item."
    },
    "learnerInstructions": {
      "type": Type.STRING,
      "description": "A single string containing paragraphs or numbered steps, with a blank line between each item."
    },
    "learningAreas": {
      "type": Type.ARRAY,
      "items": { "type": Type.STRING }
    },
    "outcomeCodes": {
      "type": Type.OBJECT,
      "properties": {
        "English": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "Maths": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "Science": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "HASS": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "Technologies": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "The Arts": { "type": Type.ARRAY, "items": { "type": Type.STRING } },
        "HPE": { "type": Type.ARRAY, "items": { "type": Type.STRING } }
      },
      "description": "An object where keys are subject names and values are arrays of relevant outcome codes. Only include subjects that were selected."
    },
    "identifiedThemes": {
      "type": Type.ARRAY,
      "items": { "type": Type.STRING },
      "description": "An array of themes selected *ONLY* from the predefined list that are relevant to the activity."
    },
    "suggestedThemes": {
      "type": Type.ARRAY,
      "items": { "type": Type.STRING },
      "description": "An array of *additional* relevant themes identified by the AI that are *NOT* on the predefined list."
    }
  },
  required: ["activityTitle", "activitySubtitle", "activityDescription", "learnerDescription", "resources", "activityPlan", "learnerInstructions", "learningAreas", "outcomeCodes", "identifiedThemes", "suggestedThemes"]
};

const buildContext = (facilitatorName: string, learnerName: string, selectedSubjects: string[]) => {
    let personalizationContext = "\n--- PERSONALIZATION ---";
    personalizationContext += `\nFacilitator's Name: ${facilitatorName || '(Not provided)'}`;
    personalizationContext += `\nLearner's Name: ${learnerName || '(Not provided)'}`;
    personalizationContext += "\n-----------------------\n";

    let learningOutcomesReference = "\n--- RELEVANT LEARNING OUTCOMES (YEAR 5) ---\n";
    selectedSubjects.forEach(subject => {
        learningOutcomesReference += `\n** ${subject} **\n`;
        if (allLearningOutcomes[subject]) {
            allLearningOutcomes[subject].forEach(outcome => {
                learningOutcomesReference += `${outcome.code}: ${outcome.desc}\n`;
            });
        }
    });
    learningOutcomesReference += "\n--------------------------------------------\n";

    let themesReference = "\n--- EXISTING THEMES LIST ---";
    themesReference += `\n${existingThemes.join(', ')}`;
    themesReference += "\n----------------------------\n";
    
    return { personalizationContext, learningOutcomesReference, themesReference };
};

export const generatePlan = async (
    facilitatorName: string,
    learnerName: string,
    userPrompt: string,
    selectedSubjects: string[]
): Promise<{ plan: ActivityPlan, context: { personalizationContext: string, learningOutcomesReference: string, themesReference: string } }> => {
    const { personalizationContext, learningOutcomesReference, themesReference } = buildContext(facilitatorName, learnerName, selectedSubjects);

    const systemPrompt = `You are an expert curriculum designer for Australian early childhood education (Year 5 level), adhering to the Early Years Learning Framework (EYLF) and Australian Curriculum. The user will provide a brief activity idea, AND optionally a facilitator's name and a learner's name. Your task is to expand this into a complete, structured activity plan. All generated text MUST use Australian (AU) spelling and language conventions. You MUST generate content for all fields in the schema. CRITICAL INSTRUCTIONS: 1. **ORDERING:** The keys in the 'outcomeCodes' object MUST follow this specific order (if they have content): English, Maths, Science, HASS, Technologies, The Arts, HPE. 2. **CONSISTENCY:** For *every single subject* you find a relevant outcome for (e.g., "Science"), you MUST include "Science" in the 'learningAreas' array AND you MUST include a "Science": [...] key in the 'outcomeCodes' object. Do not omit any. You MUST respond ONLY with a valid JSON object matching the provided schema. Do not include any other text, markdown, or explanations.`;
    const fullUserPrompt = personalizationContext + userPrompt + learningOutcomesReference + themesReference;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullUserPrompt,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA
        }
    });
    
    const plan = JSON.parse(response.text) as ActivityPlan;
    return { plan, context: { personalizationContext, learningOutcomesReference, themesReference } };
};

export const extendPlan = async (
    currentPlan: ActivityPlan,
    context: { personalizationContext: string, learningOutcomesReference: string, themesReference: string }
): Promise<ActivityPlan> => {
    const extendSystemPrompt = `You are an expert curriculum designer for Australian early childhood education (Year 5 level). Your task is to *extend and enhance* the provided JSON activity plan to be more comprehensive. The primary goal is to modify the 'activityPlan', 'resources', and 'learnerInstructions' to connect the activity to *more* of the provided learning outcome codes. You must analyze the existing plan and the *full list* of learning outcomes and find new creative ways to meet more outcomes. You MUST respond with a new, complete JSON object matching the original schema. All text MUST use Australian (AU) spelling and language conventions. The 'activitySubtitle' MUST remain 8 words or less. Personalize the response using the provided facilitator and learner names. The theme lists should be re-evaluated and updated if new connections are made. CRITICAL INSTRUCTIONS: 1. **FORMATTING:** For 'activityPlan' and 'learnerInstructions', you MUST format them as a single string with paragraphs or numbered lists **with a blank line (a double newline) between each item**. 2. **ORDERING:** The keys in the 'outcomeCodes' object MUST follow this specific order (if they have content): English, Maths, Science, HASS, Technologies, The Arts, HPE. 3. **CONSISTENCY:** For *every single subject* you find a relevant outcome for, you MUST include it in the 'learningAreas' array AND 'outcomeCodes' object.`;
    
    const existingPlanJson = JSON.stringify(currentPlan, null, 2);
    const fullExtendPrompt = `--- EXISTING PLAN TO EXTEND ---
${existingPlanJson}

--- ORIGINAL CONTEXT (DO NOT CHANGE) ---
${context.personalizationContext}
${context.learningOutcomesReference}
${context.themesReference}

Please extend the activity plan above to be more comprehensive and meet more of the learning outcomes from the reference list.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullExtendPrompt,
        config: {
            systemInstruction: extendSystemPrompt,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA
        }
    });
    
    return JSON.parse(response.text) as ActivityPlan;
};
