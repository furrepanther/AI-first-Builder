<p align="center">
  <img src="https://github.com/user-attachments/assets/024b29be-3059-492d-bdcc-d82af0325e64">
</p>

<h1 align="center">🤖 App Builder — AI Website Generator</h1>

<p align="center"><i>Build websites instantly with AI • Create your own AI builder</i></p>
<p align="center">
An open-source, AI-powered website generator that creates production-ready React applications from natural language prompts. Use it as-is or as a foundation to build your own custom AI builder.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License MIT">
  </a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/AI-GPT--4o-blue.svg" alt="GPT-4o Powered">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI_GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Convex-FF6F61?style=for-the-badge&logo=convex&logoColor=white" />
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## What is App Builder?

App Builder is an **AI-powered website generator** that transforms your ideas into fully functional React applications. Simply describe what you want to build in plain English, and watch as the AI generates complete, production-ready code with modern styling and best practices.

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <img src="https://github.com/user-attachments/assets/c30f1bfe-5098-4c22-ab2b-0537f1802322" alt="Preview 1" width="100%"/>
        <br/>
        <sub><b>Describe your website in natural language</b></sub>
      </td>
      <td align="center" width="50%">
        <img src="https://github.com/user-attachments/assets/f7187bb9-1905-444c-9b0d-1fc47d8ec9c9" alt="Preview 2" width="100%"/>
        <br/>
        <sub><b>Get production-ready React code instantly</b></sub>
      </td>
    </tr>
  </table>
</div>

### Two Ways to Use This Project

| For End Users | For Developers |
|--------------|----------------|
| Generate websites instantly from prompts | Fork and customize to build your own AI builder |
| Export production-ready React code | Swap AI providers (OpenAI, Anthropic, Gemini, etc.) |
| Live preview with hot reload | Modify prompts for different frameworks |
| Download complete project files | Add your own features and integrations |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Features

| AI Generation | Developer Experience | Customization |
|:---:|:---:|:---:|
| Natural language to code | Live code preview | Swappable AI models |
| Multi-file project generation | Real-time updates | Customizable prompts |
| Smart component organization | Export & download | Extensible architecture |
| Modern Tailwind styling | Sandpack integration | Open source codebase |

**What the AI Generates:**
- Complete React applications with proper file structure
- Modern, responsive Tailwind CSS styling
- Gradient backgrounds, glassmorphism, and animations
- Lucide React icons and Framer Motion animations
- Production-ready, well-organized code

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Convex account ([Sign up free](https://convex.dev))

### Installation

```bash
# Clone the repository
git clone https://github.com/SamTerces/App-Builder.git
cd App-Builder

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Required: Convex Deployment URL
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### Run the Development Server

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start Convex (in a separate terminal)
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) and start building!

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Prompt   │────▶│   AI Processing  │────▶│  Generated App  │
│                 │     │                  │     │                 │
│ "Create a SaaS  │     │  • GPT-4o        │     │  • React files  │
│  landing page   │     │  • Prompt Engine │     │  • Tailwind CSS │
│  with pricing"  │     │  • Code Gen      │     │  • Components   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                                               ┌─────────────────┐
                                               │   Live Preview  │
                                               │                 │
                                               │   Sandpack IDE  │
                                               │   Code Editor   │
                                               │   Export/DL     │
                                               └─────────────────┘
```

### The Generation Pipeline

1. **Prompt Enhancement** — Your simple prompt is enhanced with detailed design specifications
2. **AI Code Generation** — GPT-4o generates complete React code with proper structure
3. **Live Preview** — See your app instantly in the embedded Sandpack environment
4. **Export** — Download the complete project ready for deployment

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Build Your Own AI Builder

This project is designed to be a **foundation for building custom AI builders**. Here's how to customize it:

### 1. Swap AI Providers

Edit `configs/AiModel.jsx` to use different AI providers:

```javascript
// Current: OpenAI GPT-4o
import OpenAI from 'openai';

// You can switch to:
// - Anthropic Claude
// - Google Gemini
// - Groq
// - Local models via Ollama
// - Any OpenAI-compatible API
```

### 2. Customize Generation Prompts

Edit `data/Prompt.jsx` to change what gets generated:

```javascript
// Modify CODE_GEN_PROMPT for different:
// - Frameworks (Vue, Svelte, Angular)
// - Styling (CSS Modules, Styled Components)
// - Design systems (Material UI, Chakra)
// - Code patterns and structure
```

### 3. Add New Features

The modular architecture makes it easy to add:
- Authentication systems
- Template libraries
- Custom component palettes
- Deployment integrations
- Version history
- Collaboration features

### Project Structure

```
App-Builder/
├── app/                    # Next.js 15 App Router
│   ├── (main)/            # Main app routes
│   │   └── workspace/     # Workspace pages
│   ├── api/               # API routes
│   └── layout.js          # Root layout
│
├── components/
│   ├── custom/            # App-specific components
│   │   ├── ChatView.jsx   # Chat interface
│   │   ├── CodeView.jsx   # Code preview with Sandpack
│   │   ├── Header.jsx     # Navigation header
│   │   └── Hero.jsx       # Landing page hero
│   └── ui/                # Reusable UI components
│
├── configs/
│   └── AiModel.jsx        # AI provider configuration
│
├── data/
│   ├── Prompt.jsx         # AI prompts (customize these!)
│   └── Lookup.jsx         # Static data/constants
│
├── convex/                # Convex backend
│   ├── workspace.js       # Workspace functions
│   └── schema.ts          # Database schema
│
├── context/               # React contexts
└── lib/                   # Utilities
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Frontend** | React 18, Tailwind CSS |
| **AI** | OpenAI GPT-4o |
| **Backend** | Convex (real-time database) |
| **Code Preview** | Sandpack |
| **Icons** | Lucide React |
| **Styling** | Tailwind CSS, tailwindcss-animate |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Example Prompts

Try these prompts to see the AI in action:

| Prompt | What You Get |
|--------|--------------|
| "Create a modern portfolio website with dark theme" | Hero, projects grid, about section, contact form |
| "Build a SaaS landing page with pricing cards" | Hero, features, pricing tiers, testimonials, CTA |
| "Make a restaurant website with menu and reservations" | Hero, menu sections, gallery, reservation form |
| "Design a fitness app dashboard" | Stats cards, workout tracker, progress charts |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions

- Add support for more AI providers
- Create new starter templates
- Improve prompt engineering
- Add export options (CodeSandbox, StackBlitz)
- Build a template marketplace
- Add collaborative editing

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamTerces/App-Builder)

**Required Environment Variables:**

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |

> **Note:** The live preview may have limitations on Vercel due to API timeout limits. For best results, run locally or use Vercel Pro for extended timeouts.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

**You are free to:**
- Use this commercially
- Modify and distribute
- Build and sell your own AI builder based on this

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Acknowledgments

Built with these amazing technologies:

- [OpenAI](https://openai.com) — GPT-4o for code generation
- [Next.js](https://nextjs.org) — React framework
- [Convex](https://convex.dev) — Real-time backend
- [Sandpack](https://sandpack.codesandbox.io) — In-browser code preview
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<div align="center">
  <b>Build your own AI-powered tools with App Builder as your foundation</b>
  <br><br>
  <a href="#-app-builder--ai-website-generator">Back to Top</a>
</div>
