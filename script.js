// ==================================================
// Project Imports
// ==================================================

// App.jsx
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

// ==================================================
// General Notes for Rosie AI
// ==================================================

// Note: In sandboxed environments, avoid using <form> elements and traditional
// form submissions as they may be blocked by security policies. Instead, use
// controlled components with direct event handlers (onClick, onChange, etc.).

// ==================================================
// ChatAIClass Definition
// ==================================================

// This module provides a class, ChatAIClass, which uses a ChatManager (provided externally) 
// to conduct a conversation with an AI. The AI's behavior is defined by a description string, 
// and the ChatAIClass offers a simple getResponse method to get AI responses.
// 
// This is AI is powered by Rosebud AI and is Rosebud's method to add in-game AI features.
//
// IMPORTANT NOTE:
// - Do not assume how ChatManager works beyond what is described here.
// - We only know that:
//   1. ChatManager is constructed by passing in a description string.
//   2. We can add messages by calling chatManager.addMessage('user', prompt).
//   3. We can get an AI-generated response by calling chatManager.getCharacterResponse('classify').
// - Any other assumptions about ChatManager internals or methods should not be made.
//
// This code can be used in any JS project by simply importing this class and using it.
//////////////////////////////////////////////////////////////

// Defines how the AI should behave for RizzApp
const AI_BEHAVIOR_DESCRIPTION = `
You are a sophisticated conversation assistant that helps craft authentic and engaging responses.
Consider these parameters for each response:
- Interest Level (1-10): Higher values indicate more engagement, lower values are more reserved
- Tone Level (1-10): Higher values maintain professionalism, lower values are more casual
Key Guidelines:
- Avoid clichéd or obviously artificial responses
- Use natural language patterns and conversational tone
- Match the context and energy of the original message
- Never use explicit content or inappropriate language
- Maintain authenticity while being engaging
Response Styles:
- CONTINUE: Natural conversation continuation with subtle engagement cues
- END: Graceful conversation conclusion without awkwardness
- NEUTRAL: Balanced response that matches the original message's energy
- PLAYFUL: Light and genuine with subtle wit
- SERIOUS: Authentic and thoughtful response showing genuine interest
`;

/**
 * ChatAIClass:
 * 
 * This class is intended for non-technical users who want to interact with an AI system.
 * 
 * Usage:
 * 1. Create an instance of ChatAIClass:
 *    const chat = new ChatAIClass();
 * 
 * 2. Call getResponse(prompt) to get a response from the AI:
 *    const answer = await chat.getResponse("What is quantum computing?");
 *    console.log(answer);
 */

export class ChatAIClass {
    constructor() {
        // Directly create a new ChatManager instance with the AI behavior description.
        // We assume ChatManager is available globally or imported from elsewhere.
        this.chatManager = new ChatManager(AI_BEHAVIOR_DESCRIPTION);
    }

    /**
     * Generates a response from the AI based on the given prompt.
     *
     * @param {string} prompt - The user's input or question.
     * @returns {Promise<string>} - The AI's response as text.
     */
    async getResponse(prompt) {
        // Add the user's message to the conversation.
        this.chatManager.addMessage('user', prompt);

        // Ask the ChatManager for the AI's response and return it.
        const response = await this.chatManager.getCharacterResponse('classify');

        // Add the AI's message to the conversation so it has memory of it.
        this.chatManager.addMessage('assistant', response);

        return response;
    }
}

// ==================================================
// Main App Component with Three.js Scene
// ==================================================

const App = () => {
  const [message, setMessage] = useState('');
  const [flirtLevel, setFlirtLevel] = useState(5);
  const [appropriateLevel, setAppropriateLevel] = useState(8);
  const [responseMode, setResponseMode] = useState('NEUTRAL');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const chatAI = useRef(new ChatAIClass());
  const RESPONSE_MODES = [
    { value: 'CONTINUE', label: '💭 Continue', 
      description: 'Keep the conversation flowing naturally' },
    { value: 'END', label: '👋 End', 
      description: 'Gracefully conclude the chat' },
    { value: 'NEUTRAL', label: '😊 Neutral', 
      description: 'Balanced and matching tone' },
    { value: 'PLAYFUL', label: '😏 Casual', 
      description: 'Light and fun response' },
    { value: 'SERIOUS', label: '💫 Genuine', 
      description: 'Thoughtful and authentic' },
    { value: 'FLIRTY', label: '💝 Flirty', 
      description: 'Subtly flirtatious tone' },
    { value: 'MYSTERIOUS', label: '🌙 Mysterious', 
      description: 'Intriguing and enigmatic' },
    { value: 'WITTY', label: '✨ Witty', 
      description: 'Clever and humorous' },
    { value: 'CARING', label: '🤗 Caring', 
      description: 'Warm and supportive' },
    { value: 'COOL', label: '😎 Cool', 
      description: 'Relaxed and confident' },
  ];
  const responseRef = useRef(null);
  const scrollToResponse = () => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const generateResponse = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const prompt = `Create a natural response to: "${message}"
        Interest Level: ${flirtLevel}/10 (engagement level)
        Tone Level: ${appropriateLevel}/10 (formality)
        Style: ${responseMode}
        
        Important: Maintain authenticity and avoid artificial or clichéd language. Response should feel natural and genuine.`;
      const result = await chatAI.current.getResponse(prompt);
      setResponse(result);
    } catch (error) {
      console.error('Error generating response:', error);
      setResponse('Sorry, there was an error generating your response.');
    }
    setLoading(false);
  };
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
      }}>
        <h1 style={{ color: '#00ffff', marginBottom: '30px' }}>✨ RizzSite ✨</h1>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '15px',
          width: '80%',
          maxWidth: '600px',
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#00ffff' }}>
              🎭 Choose Your Vibe:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '8px',
              marginBottom: '20px',
            }}>
              {RESPONSE_MODES.map((mode) => (
                <div
                  key={mode.value}
                  onClick={() => setResponseMode(mode.value)}
                  style={{
                    padding: '8px',
                    background: responseMode === mode.value ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${responseMode === mode.value ? '#00ffff' : 'transparent'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{mode.label}</div>
                  <div style={{ fontSize: '0.7em', opacity: 0.8 }}>{mode.description}</div>
                </div>
              ))}
            </div>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="✍️ Paste the message you received..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #00ffff',
              background: 'rgba(0, 0, 0, 0.2)',
              color: '#ffffff',
            }}
          />
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Interest Level: {flirtLevel}
              <input
                type="range"
                min="1"
                max="10"
                value={flirtLevel}
                onChange={(e) => setFlirtLevel(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Tone Level: {appropriateLevel}
              <input
                type="range"
                min="1"
                max="10"
                value={appropriateLevel}
                onChange={(e) => setAppropriateLevel(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </label>
          </div>
          
          
          <button
            onClick={generateResponse}
            disabled={loading || !message.trim()}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#4a4a5a' : '#00ffff',
              color: loading ? '#ffffff' : '#000000',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {loading ? '✨ Generating...' : '✨ Generate Response'}
          </button>
          
          {response && (
            <div 
              ref={responseRef}
              style={{
                marginTop: '20px',
                padding: '20px',
                background: 'rgba(0, 255, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid #00ffff',
                maxHeight: '300px',
                overflowY: 'auto',
                scrollBehavior: 'smooth',
              }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>💫 Generated Response:</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{response}</p>
            </div>
          )}
          
          {response && (
            <button
              onClick={scrollToResponse}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 255, 255, 0.8)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
                color: '#1a1a2e',
                boxShadow: '0 2px 10px rgba(0, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.8)';
              }}
            >
              ↓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
const container = document.getElementById('renderDiv');
const root = ReactDOM.createRoot(container);
root.render(<App />);
