# Wikipedia Suggestion Mode Prototype

Interactive UX prototype demonstrating the **Suggestion Mode** feature in Wikipedia's Edit interface.

## 📋 Overview

This project is an interactive prototype that implements a suggestion mode for Wikipedia's article editing interface. When enabled, the suggestion mode displays AI-powered or rule-based suggestions (e.g., "Add a citation") alongside the article content, helping editors improve article quality.

## ✨ Features

### Suggestion Mode in Edit Mode

- **Toggle Suggestions**: Lightbulb button in the editor toolbar to enable/disable suggestions
- **Dynamic Layout**: 
  - **Default**: Article content is centered on the page (949px max-width)
  - **With suggestions active**: Content shifts left with a smooth CSS Grid animation, and a 325px suggestions panel appears on the right
- **Interactive Suggestion Cards**:
  - Collapsed and expanded states
  - Hover effects synchronized with highlighted text
  - Click to expand/collapse
- **Highlighted Text**: Visual indicators in the article showing where suggestions apply
- **Smooth Transitions**: CSS Grid-based layout with 250ms ease transitions

### Technical Implementation

- **CSS Grid Layout**: Responsive grid that adapts when suggestions are toggled
- **Grid columns**:
  - Without suggestions: `1fr minmax(0, 949px) 1fr` (centered)
  - With suggestions: `minmax(0, 949px) 24px 325px` (left-aligned with right panel)
- **Vue 3 Composition API**: Reactive state management
- **Wikimedia Codex**: Design system components and tokens

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bmartinezcalvo/suggestion-mode.git

# Navigate to project directory
cd suggestion-mode

# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev

# Open browser to http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

1. **Navigate to Edit Mode**: Click the "Edit" tab in the article toolbar
2. **Enable Suggestions**: Click the lightbulb icon in the editor toolbar
3. **View Suggestions**: The layout will shift and suggestion cards will appear on the right
4. **Interact with Suggestions**:
   - Hover over highlighted text or suggestion cards
   - Click to expand/collapse suggestion details
   - Click "Yes" or "No" to accept or dismiss suggestions

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Build tool and dev server
- **Wikimedia Codex** - Design system for Wikimedia projects
- **CSS Grid** - Layout system for responsive design
- **TypeScript** - Type-safe JavaScript

## 📐 Layout Specifications

### Without Suggestions
- Article content: 949px max-width
- Position: Centered in viewport
- Grid: `1fr minmax(0, 949px) 1fr`

### With Suggestions
- Article content: 949px (left-aligned)
- Gap: 24px
- Suggestions panel: 325px
- Grid: `minmax(0, 949px) 24px 325px`
- Total width: 1298px

## 🎨 Design Tokens

This project uses Wikimedia Codex design tokens for:
- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Transitions

## 📝 Project Structure

```
src/
├── components/
│   └── WikipediaPage.vue    # Main component with suggestion mode
├── assets/
│   └── images/              # Article images and icons
├── App.vue                  # Root component
└── main.js                  # Application entry point
```

## 🔄 State Management

The suggestion mode is controlled by a simple reactive boolean:

```javascript
const showSuggestions = ref(false)
```

When toggled:
1. CSS Grid layout transitions smoothly (250ms)
2. Suggestion cards appear/disappear
3. Highlighted text is shown/hidden
4. Layout shifts from centered to left-aligned

## 🎭 Interaction States

### Suggestion Cards
- **Collapsed**: Border `#dadde3`, no shadow
- **Expanded**: Border `#6485d1`, box shadow
- **Hover**: Background `#e8eeff`

### Highlighted Text
- **Default**: Background `#f8f9fa`
- **Hover**: Background `#e8eeff`
- **Selected**: Background `#e8eeff`

## 🧪 Testing

This is a **UX prototype** designed for testing and demonstration purposes. It includes:
- Fake data and mock interactions
- No backend or API calls
- Simplified state management
- Focus on visual fidelity and interaction patterns

## 📦 Base Template

This project is based on the [Wikipedia Article Template](https://github.com/bmartinezcalvo/wikipedia-article-template) but extends it with the suggestion mode feature.

## 👤 Author

**Barbara Martinez Calvo**
- GitHub: [@bmartinezcalvo](https://github.com/bmartinezcalvo)

## 📄 License

This project is intended for UX research and prototyping purposes.

## 🙏 Acknowledgments

- Wikipedia and Wikimedia Foundation for design inspiration
- Wikimedia Codex design system
- Vue.js community

---

**Note**: This is an interactive prototype for UX testing and demonstration purposes only. It is not production-ready code and should not be used in a live Wikipedia environment.
