import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

async function enhancePrompt(prompt: string, provider: string, model: string, settings: any) {
  let enhancedPrompt = '';

  if (provider === 'google') {
    const googleAI = new GoogleGenerativeAI(settings.googleApiKey);
    const genAI = googleAI.getGenerativeModel({ model: model });
    const result = await genAI.generateContent(
      `Enhance this Stable Diffusion prompt for better image generation. Make it more detailed and descriptive, Auto1111 or stable diffusion style using tags, only output the prompt: ${prompt}`
    );
    enhancedPrompt = result.response.text();
  } else if (provider === 'anthropic') {
    const anthropic = new Anthropic({
      apiKey: settings.anthropicApiKey,
    });

    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Enhance this Stable Diffusion prompt for better image generation. Make it more detailed and descriptive, Auto1111 or stable diffusion style using tags, only output the prompt: ${prompt}`
      }]
    });
    enhancedPrompt = message.content.toString();
  } else if (provider === 'lmstudio') {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:1234';
    const openai = new OpenAI({
      baseURL: `${API_BASE_URL}/v1`,
      apiKey: 'lm-studio',
    });

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ 
        role: 'user', 
        content: `Enhance this Stable Diffusion prompt for better image generation. Make it more detailed and descriptive, Auto1111 or stable diffusion style using tags, only output the prompt: ${prompt}`
      }],
      temperature: 0.7,
    });

    enhancedPrompt = completion.choices[0].message.content || '';
  }
  
  return enhancedPrompt;
}

async function enhanceDescription(description: string, provider: string, model: string, settings: any) {
  let enhancedDescription = '';

  if (provider === 'google') {
    const googleAI = new GoogleGenerativeAI(settings.googleApiKey);
    const genAI = googleAI.getGenerativeModel({ model: model });
    const result = await genAI.generateContent(
      `Enhance this project description for better storytelling. Make it more detailed and descriptive, description only output: ${description}`
    );
    enhancedDescription = result.response.text();
  } else if (provider === 'anthropic') {
    const anthropic = new Anthropic({
      apiKey: settings.anthropicApiKey,
    });

    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Enhance this project description for better storytelling. Make it more detailed and descriptive, description only output: ${description}`
      }]
    });
    enhancedDescription = message.content.toString();
  } else if (provider === 'lmstudio') {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:1234';
    const openai = new OpenAI({
      baseURL: `${API_BASE_URL}/v1`,
      apiKey: 'lm-studio',
    });

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ 
        role: 'user', 
        content: `Enhance this project description for better storytelling. Make it more detailed and descriptive, description only output: ${description}`
      }],
      temperature: 0.7,
    });

    enhancedDescription = completion.choices[0].message.content || '';
  }

  return enhancedDescription;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get API keys from settings API using absolute URL
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = req.headers.host || 'localhost:3000';
      const settingsUrl = `${protocol}://${host}/api/settings`;
      
      const settingsResponse = await fetch(settingsUrl);
      if (!settingsResponse.ok) {
        return res.status(500).json({ error: 'Failed to fetch settings' });
      }
      const settings = await settingsResponse.json();

      const models = {
        google: [
          { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
          { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
        ],
        anthropic: [
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
        ],
        lmstudio: [],
      };

      // Try to fetch LM Studio Models
      try {
        console.log('Fetching LM Studio models');
        const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:1234';
        const response = await fetch(`${API_BASE_URL}/v1/models`);
        const data = await response.json();
        models.lmstudio = data.data.map((model: any) => ({
          id: model.id,
          name: model.name || model.id
        }));
      } catch (error) {
        console.warn('LM Studio server not available:', error);
      }

      return res.status(200).json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      return res.status(500).json({
        error: 'Failed to fetch models',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:3000';
    const settingsUrl = `${protocol}://${host}/api/settings`;
    
    const settingsResponse = await fetch(settingsUrl);
    if (!settingsResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
    const settings = await settingsResponse.json();

    const { prompt, description, provider, model } = req.body;

    // Process both prompt and description if provided
    const result: any = {};

    if (description) {
      result.enhancedDescription = await enhanceDescription(description, provider, model, settings);
    }

    if (prompt) {
      result.enhancedPrompt = await enhancePrompt(prompt, provider, model, settings);
    }

    if (!prompt && !description) {
      return res.status(400).json({ error: 'Either prompt or description is required' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error enhancing content:', error);
    return res.status(500).json({ 
      error: 'Failed to enhance content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}