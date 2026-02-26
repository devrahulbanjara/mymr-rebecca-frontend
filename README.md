# Rebecca - AI Healthcare Assistant

Rebecca is an intelligent AI healthcare assistant built with React and Vite, designed to help users access and understand medical records through natural, conversational interactions.

## Features

- **Intelligent AI Assistant**: Powered by Claude 3.5 Sonnet for accurate medical record analysis
- **Natural Conversations**: Ask questions in plain language about patient medical history
- **Citation Support**: Responses include references to source documents
- **Real-time Analysis**: Get instant insights with performance metrics
- **Modern UI**: Clean, professional interface built with Tailwind CSS

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React Icons
- React Markdown

## Getting Started

### Installation

```bash
cd MyMR-Chatbot-frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## API Integration

Rebecca connects to a backend API endpoint at `/api/chat` expecting:

**Request:**
```json
{
  "query": "What medications are prescribed?",
  "patient_id": "patient-uuid",
  "document_type": ""
}
```

**Response:**
```json
{
  "complete_response": [
    {
      "model_name": "Claude-3.5-Sonnet",
      "response": "**Patient Name**: KHANAL, MOHAN PRASAD",
      "latency": 6.458,
      "input_tokens": 6663,
      "output_tokens": 18,
      "total_cost": 0.020259
    }
  ]
}
```

## Project Structure

```
src/
├── components/
│   ├── ChatWindow.jsx      # Main chat interface
│   ├── Sidebar.jsx         # Patient selection sidebar
│   └── ModelResponseCard.jsx # (Legacy - can be removed)
├── constants/
│   └── patients.js         # Patient data
├── App.jsx                 # Main application component
└── main.jsx               # Application entry point
```

## License

Private - MyMR Healthcare Platform

