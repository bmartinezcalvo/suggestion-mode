# Wikipedia Article Template

High-fidelity Wikipedia article page template built with **Vue 3** and **Wikimedia Codex** for creating interactive UX prototypes.

## 🎨 Preview

Complete implementation of a Wikipedia article (Audre Lorde) featuring:
- Responsive header with functional search
- Collapsible Table of Contents
- Structured infobox with image
- Tools sidebar
- Responsive design (tablet breakpoint: 1119px)

## 🚀 Tech Stack

- **Vue 3** (Composition API with `<script setup>`)
- **Wikimedia Codex** - Official design system
  - Components: `CdxTypeaheadSearch`, `CdxIcon`
  - Official design tokens
  - Codex icon library
- **Vite** - Build tool and dev server
- **Custom CSS** (no Tailwind, maximum Figma fidelity)

## 📦 Installation

```bash
# Clone the repository
git clone [YOUR-REPO-URL]
cd prototipo-test

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage

### As a Base Template

This project is designed to be a starting point for Wikipedia-style prototypes:

1. **Clone or fork** this repository
2. **Modify content** in `src/components/WikipediaPage.vue`
3. **Update data** (title, images, infobox, article content)
4. **Keep the structure** for design consistency

### Main Component

The `WikipediaPage.vue` component includes:

- ✅ Header with logo, functional search, and user navigation
- ✅ Table of Contents (TOC) with Codex icons
- ✅ Article content with Wikipedia typography
- ✅ Infobox with photo and structured data
- ✅ Tools sidebar
- ✅ Fully responsive behavior

## 📱 Responsive Design

**Breakpoint: 1119px (tablet)**

When screen width ≤ 1119px:
- Both sidebars (TOC and Tools) are hidden
- TOC button (☰) appears before the article title
- "Tools" button appears after the star icon

### Desktop Layout
```
[TOC Sidebar] [Article Content] [Tools Sidebar]
```

### Mobile Layout (≤ 1119px)
```
[☰] Article Title                [Tools ▾]
        [Article Content]
```

## 🎨 Customization

### Change Article Content

Edit sections in `WikipediaPage.vue`:

```vue
<template>
  <h1 class="article-title">Your Title</h1>
  <p>Your content...</p>
</template>
```

### Update Infobox

Modify data in the `.infobox` section:

```vue
<script setup>
const articleImage = "your-image-url.jpg";
const articleTitle = "Your Title";
</script>

<template>
  <div class="infobox-image">
    <img :src="articleImage" alt="Description" />
  </div>
</template>
```

### Update Table of Contents

Edit items in the TOC:

```vue
<!-- With chevron (expandable) -->
<div class="toc-item">
  <button class="toc-expand">
    <cdx-icon :icon="cdxIconNext" size="small" />
  </button>
  <a href="#section" class="toc-link">Section Name</a>
</div>

<!-- Without chevron -->
<div class="toc-item toc-item-no-chevron">
  <a href="#section" class="toc-link">Section Name</a>
</div>
```

### Icons

All icons use Codex icons:

```vue
import { 
  cdxIconMenu, 
  cdxIconBell, 
  cdxIconNext 
} from '@wikimedia/codex-icons';
```

Available sizes: `small` (12px) and `medium` (20px)

## 📁 Project Structure

```
prototipo-test/
├── src/
│   ├── components/
│   │   └── WikipediaPage.vue   # Main component
│   ├── App.vue                 # Entry point
│   ├── main.js                 # Vue initialization
│   └── style.css               # Global styles + Codex imports
├── .cursor/rules/              # Project workspace rules
│   ├── codex-design-system.mdc
│   ├── figma-fidelity.mdc
│   ├── interaction-prototyping.mdc
│   └── screenshot-fidelity.mdc
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📋 Features

### Integrated Codex Components

- **TypeaheadSearch**: Functional search connected to Wikipedia API
- **CdxIcon**: Official icon system with proper sizing
- **Design Tokens**: Official Codex colors, spacing, and typography

### Design Fidelity

✅ Based on Figma designs  
✅ Pixel-perfect spacing and proportions  
✅ Official typography (Source Serif Pro, Linux Libertine)  
✅ Codex colors and design tokens  
✅ Semantic HTML structure  
✅ ARIA labels for accessibility  

### Responsive Behavior

✅ Desktop: Full layout with both sidebars  
✅ Tablet (≤1119px): Collapsible sidebars with toggle buttons  
✅ Smooth transitions and hover states  
✅ Touch-friendly interactive elements  

## 🧩 Codex Components Used

### CdxTypeaheadSearch
- Connected to Wikipedia Search API
- Shows search suggestions with thumbnails
- Highlight query matching
- Auto-expand width
- Custom search footer

### CdxIcon
- Icon sizes: `small` (12px), `medium` (20px)
- Icons used:
  - `cdxIconMenu` - Hamburger menu
  - `cdxIconBell` - Notifications
  - `cdxIconTray` - Messages
  - `cdxIconWatchlist` - Watchlist
  - `cdxIconUserAvatar` - User profile
  - `cdxIconExpand` - Dropdowns/chevrons
  - `cdxIconLanguage` - Language selector
  - `cdxIconStar` - Favorites/watch
  - `cdxIconNext` - TOC expand arrows
  - `cdxIconListBullet` - TOC toggle button

## 🎓 Notes for UX Designers

This is an **interactive prototype**, not production code:

- ❌ No real backend
- ❌ No authentication system
- ❌ Static data (except search functionality)
- ✅ Perfect for UX testing
- ✅ Easy to modify and iterate
- ✅ Fast prototyping workflow
- ✅ High design fidelity

### Design Principles

1. **Fidelity over perfection**: Match Figma designs exactly
2. **No improvements**: Don't modernize or redesign
3. **Explicit over clever**: Simple, readable code
4. **Prototype mindset**: Optimize for iteration speed

## 🔗 Resources

- [Codex Documentation](https://doc.wikimedia.org/codex/latest/)
- [Codex Components](https://doc.wikimedia.org/codex/latest/components/overview.html)
- [Codex Design Tokens](https://doc.wikimedia.org/codex/latest/design-tokens/)
- [Codex Icons Gallery](https://doc.wikimedia.org/codex/latest/icons/all-icons.html)
- [Wikipedia API Documentation](https://www.mediawiki.org/wiki/API:Main_page)
- [Vue 3 Documentation](https://vuejs.org/)

## 🚀 Using as a GitHub Template

To use this repository as a template for future projects:

1. **On GitHub**: Go to repository Settings
2. **Check**: "Template repository"
3. **Create new projects**: Click "Use this template" button
4. **Clone and modify**: Start prototyping immediately

## 🛠️ Extending the Template

### Add New Sections

```vue
<section class="article-section">
  <h2 class="section-title">Your Section</h2>
  <p class="section-content">Your content...</p>
</section>
```

### Add New TOC Items

```vue
<div class="toc-item">
  <button class="toc-expand">
    <cdx-icon :icon="cdxIconNext" size="small" />
  </button>
  <a href="#your-section" class="toc-link">Your Section</a>
</div>
```

### Style Customization

All styles are in `<style scoped>` within `WikipediaPage.vue`. 
Key CSS variables and design tokens are inherited from Codex.

## 📄 License

This is a prototyping project template. Feel free to use it for your UX prototypes and design explorations.

## 👥 Contributing

This template is designed for internal UX team use. If you make improvements:

1. Document changes in comments
2. Update this README
3. Consider if changes should be in base template
4. Share learnings with the team

## 👤 Author

**Barbara Martinez** - UX Designer  
Wikimedia Foundation

---

## 💡 Pro Tips

- **Keyboard shortcuts**: Use browser DevTools to test responsive breakpoints
- **Fast iteration**: Keep dev server running, changes hot-reload instantly
- **Component reuse**: Extract repeated patterns into separate components
- **Design tokens**: Use Codex tokens instead of hardcoded values
- **Icons first**: Check Codex icons before creating custom ones

---

**⭐ Pro Tip**: Mark this repo as a "Template" in GitHub Settings to enable quick project creation with the "Use this template" button.

## 🐛 Troubleshooting

### Port 5173 is in use
```bash
# Vite will automatically try the next available port (5174, 5175, etc.)
# Or specify a custom port:
npm run dev -- --port 3000
```

### Codex styles not loading
```bash
# Ensure Codex styles are imported in src/style.css:
@import '@wikimedia/codex/dist/codex.style.css';
```

### Icons not showing
```bash
# Check that icons are imported:
import { cdxIconName } from '@wikimedia/codex-icons';
# And used with CdxIcon component:
<cdx-icon :icon="cdxIconName" size="medium" />
```

---

**Need help?** Check the [Codex documentation](https://doc.wikimedia.org/codex/latest/) or reach out to the design systems team.
