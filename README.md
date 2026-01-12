# Wikipedia Suggestion Mode Template

Interactive UX prototype showing the **Suggestion Mode** feature in the edit mode of a Wikipedia's article.

## Overview

This template replicates the Wikipedia article experience with both **Read** and **Edit** modes. When enabled the Suggestion Mode on Edit mode, some suggestions are displayed alongside the article content, showing editors potential improvements for the article.

## Features

### Skins
- Vector22 is the default skin
- Minerva (mobile) is selectable via the header menu or when opening the prototype on screens less than 640px

### Suggestion Mode in Edit Mode

Implemented the following in the **Edit mode** of the article:

- **Toggle Suggestions**: Lightbulb button to show/hide suggestions in the article
- **Dynamic Layout**: 
  - **Default**: Article content is centered on the page
  - **With suggestions active**: Content shifts left and suggestions appear on the right
- **Interactive Suggestion Cards**:
  - Collapsed and expanded states
  - Hover and selected effects synchronized with highlighted text
  - Card becomes a bottom sheet in Minerva skin (mobile)
- **Highlighted Text**: Visual indicators in the article showing where suggestions apply

## Getting Started

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

## Usage

1. **Navigate to Edit Mode**: Click the "Edit" tab in the article toolbar
2. **Enable Suggestions**: Click the lightbulb icon in the editor toolbar
3. **View Suggestions**: The layout will shift and suggestion cards will appear on the right
4. **Interact with Suggestions**:
   - Hover over highlighted text or suggestion cards
   - Click to expand/collapse suggestion details
   - Click "Yes" or "No" to accept or dismiss suggestions

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Build tool and dev server
- **Wikimedia Codex** - Design system for Wikimedia projects
- **CSS Grid** - Layout system for responsive design
- **TypeScript** - Type-safe JavaScript

## Customization

### Content
Edit article content directly in `WikipediaPage.vue`:
- Text sections (intro, Early life, Career)
- Infobox data
- Images (update `audreImage` constant)
  
### Skins
- Vector22 is the default skin
- Minerva (mobile) is selectable via the header menu

### Codex Design System
This project uses the Codex Wikimedia design system. Reference:
- [Codex Design Tokens](https://doc.wikimedia.org/codex/latest/design-tokens/)
- [Codex Components](https://doc.wikimedia.org/codex/latest/components/overview.html)
- [Codex Icons](https://doc.wikimedia.org/codex/latest/icons/all-icons.html)

## Contributing

This is a UX prototype template. When making changes:
1. Keep design fidelity as the top priority
2. Use Codex components and tokens
3. Test on different screen sizes
4. Avoid over-engineering - this is for user testing

## License

This template is for internal UX prototyping and testing.

---

**Note**: This is an interactive prototype, not production code. It uses fake data and simplified interactions for UX testing purposes.
