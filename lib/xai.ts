/**
 * xAI Grok API Integration Helper
 * 
 * Provides unified access to xAI (Grok) models for editorial assistance,
 * article summaries, content generation, and code review.
 * 
 * Configured via process.env.XAI_API_KEY
 */

export interface GrokRequestOptions {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GrokResponse {
  success: boolean;
  content?: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

const XAI_API_BASE = 'https://api.x.ai/v1';

/**
 * Sends a query to xAI Grok API.
 * Uses chat completions with fallback to responses endpoint.
 */
export async function queryGrok(
  prompt: string,
  options: GrokRequestOptions = {}
): Promise<GrokResponse> {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      error: 'XAI_API_KEY is not configured in environment variables. Please add your xAI API key to .env.local.',
    };
  }

  const model = options.model || 'grok-beta';
  const systemPrompt =
    options.systemPrompt ||
    'You are an expert AI assistant for ALIF FRIENDS 12, an international digital publication and educational platform.';

  try {
    // Attempt standard chat completions
    const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return {
        success: true,
        content,
        model: data.model || model,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    }

    // If chat/completions returned an error, attempt the v1/responses endpoint
    const altResponse = await fetch(`${XAI_API_BASE}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
      }),
    });

    if (altResponse.ok) {
      const data = await altResponse.json();
      const content =
        data.output ||
        data.response ||
        data.choices?.[0]?.message?.content ||
        JSON.stringify(data);
      return {
        success: true,
        content,
        model,
      };
    }

    const errText = await response.text();
    return {
      success: false,
      error: `xAI API returned HTTP ${response.status}: ${errText}`,
    };
  } catch (err: any) {
    console.error('[xAI Grok Query Error]:', err);
    return {
      success: false,
      error: err.message || 'Failed to connect to xAI Grok API.',
    };
  }
}
