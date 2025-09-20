import { GoogleGenAI, Modality, Part, GenerateContentResponse } from "@google/genai";
import { UploadedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("La variable de entorno API_KEY no está configurada.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            resolve(''); // Should not happen with readAsDataURL
        }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

const getPromptDescription = (top?: UploadedFile, bottom?: UploadedFile, accessory?: UploadedFile): string => {
    let description = "";
    const parts = [];
    if (top) parts.push("esta prenda superior");
    if (bottom) parts.push("esta prenda inferior");
    if (accessory) parts.push("este accesorio");

    if (parts.length === 1) {
        description = parts[0];
    } else if (parts.length === 2) {
        description = `${parts[0]} y ${parts[1]}`;
    } else if (parts.length === 3) {
        description = `${parts[0]}, ${parts[1]} y ${parts[2]}`;
    }
    
    return description;
}


const generateImage = async (baseParts: Part[], prompt: string): Promise<string> => {
    const allParts = [...baseParts, { text: prompt }];

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: { parts: allParts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("La respuesta de la API no contenía una imagen.");

    } catch (error) {
        console.error("Error generando imagen:", error);
        throw new Error("No se pudo generar una de las imágenes. Por favor, inténtelo de nuevo.");
    }
};


export const generateVirtualTryOn = async (
  modelImage: UploadedFile,
  topGarment?: UploadedFile,
  bottomGarment?: UploadedFile,
  accessory?: UploadedFile
): Promise<string[]> => {
    const modelPart = await fileToGenerativePart(modelImage.file);
    const topPart = topGarment ? await fileToGenerativePart(topGarment.file) : null;
    const bottomPart = bottomGarment ? await fileToGenerativePart(bottomGarment.file) : null;
    const accessoryPart = accessory ? await fileToGenerativePart(accessory.file) : null;

    const baseParts: Part[] = [modelPart];
    if (topPart) baseParts.push(topPart);
    if (bottomPart) baseParts.push(bottomPart);
    if (accessoryPart) baseParts.push(accessoryPart);
    
    const clothingDescription = getPromptDescription(topGarment, bottomGarment, accessory);
    
    const commonInstructions = `Genera una imagen realista de la misma persona del modelo de referencia. 
Debes mantener con absoluta coherencia y consistencia todas las características físicas del modelo original: 
- Rostro idéntico, incluyendo la forma facial, nariz, ojos, boca, cejas y orejas. 
- Color de piel idéntico y respetando los matices naturales. 
- Cabello con la misma forma, estilo, textura y color que en la imagen de referencia. 
- Complexión y contextura corporal exactamente iguales (ya sea delgada, robusta, con sobrepeso, muy delgada, musculosa, etc.). 
- Altura, proporciones y físico deben mantenerse fieles al modelo original, sin modificaciones.  

El único cambio permitido es la **ropa (outfit)** y, si corresponde, un **accesorio**. La modelo debe vestir ${clothingDescription}. 
En caso se incluya un accesorio de referencia (ejemplo: bolso, sombrero, collar, bufanda), este debe integrarse en el resultado de manera realista y coherente con el outfit.  

No alteres el cuerpo, rostro ni proporciones de la modelo original.  
Respeta siempre la iluminación y coherencia visual.  

El rostro debe permanecer idéntico en las 4 imágenes, sin modificaciones.

Ahora, aplica estas reglas a la siguiente escena:`;

    const prompts = [
        `${commonInstructions} Foto de cuerpo completo. Fondo: estudio profesional, blanco y limpio.`,
        `${commonInstructions} Foto de primer plano (desde el pecho hacia arriba), enfocada en su rostro y la prenda superior. Fondo: profesional, ligeramente desenfosado. La consistencia del rostro es la máxima prioridad aquí.`,
        `${commonInstructions} Foto de cuerpo completo. Fondo: un escenario doméstico realista y elegante, como una sala de estar moderna y luminosa.`,
        `${commonInstructions} Foto de cuerpo completo. Fondo: un ambiente urbano con estilo, como una calle europea con arquitectura interesante y luz natural.`
    ];

    const imagePromises = prompts.map(prompt => generateImage(baseParts, prompt));

    return Promise.all(imagePromises);
};