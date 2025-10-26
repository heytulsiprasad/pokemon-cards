# Pokémon API Demo

A demo project showcasing the use of the **@learningpad/api-client** package with the **PokéAPI**. This project demonstrates how to integrate a modern API client library with a comprehensive REST API to build a responsive Pokémon data viewer.

## 🚀 Features

- **📡 API Integration**: Uses @learningpad/api-client package for API communication
- **🎯 Pokémon Data**: Fetches and displays comprehensive Pokémon information
- **🖼️ Image Display**: Shows official Pokémon artwork and sprites
- **📊 Stats Visualization**: Visual representation of Pokémon base stats
- **🎨 Modern UI**: Built with Next.js 16, React 19, and Tailwind CSS 4
- **📱 Responsive Design**: Mobile-friendly layout with adaptive grids
- **⚡ TypeScript**: Full type safety with comprehensive type definitions
- **🔄 Interactive UI**: Click on any Pokémon to view detailed information

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Client**: [@learningpad/api-client](https://www.npmjs.com/package/@learningpad/api-client)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **API**: [PokéAPI](https://pokeapi.co/) - Free Pokémon data API
- **Package Manager**: pnpm

## 📦 Dependencies

- `@learningpad/api-client` - Modern API client library
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety
- `tailwindcss` - Utility-first CSS framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd api-client-example
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
api-client-example/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main Pokémon viewer component
│   └── globals.css         # Global styles
├── lib/
│   └── pokemon-api.ts      # API client configuration
├── types/
│   └── pokemon.ts          # TypeScript type definitions
├── public/                 # Static assets
└── package.json           # Project configuration
```

## 🔧 API Client Configuration

The project includes a custom API client (`lib/pokemon-api.ts`) that extends the @learningpad/api-client package:

```typescript
import { Pokemon, PokemonListResponse } from '@/types/pokemon';

class PokemonAPIClient {
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse>
  async getPokemon(nameOrId: string | number): Promise<Pokemon>
  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies>
}
```

## 📊 Data Displayed

For each Pokémon, the demo shows:

- **Basic Info**: Height, weight, base experience, order
- **Types**: Primary and secondary Pokémon types
- **Abilities**: All abilities including hidden abilities
- **Base Stats**: HP, Attack, Defense, Speed, Special Attack, Special Defense
- **Moves**: First 10 moves (with count of total moves)
- **Sprites**: Official artwork and game sprites
- **ID**: National Pokédex number

## 🎨 UI Features

- **Loading States**: Spinners and loading messages
- **Error Handling**: User-friendly error messages
- **Hover Effects**: Interactive hover states on Pokémon cards
- **Stat Bars**: Visual representation of base stats
- **Type Badges**: Color-coded type indicators
- **Responsive Grid**: Adapts to different screen sizes

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

You can also deploy on:
- **Netlify**: Drag and drop the build folder
- **Railway**: Auto-deploy from GitHub
- **Digital Ocean App Platform**: Container-based deployment

## 🔮 Future Enhancements

- [ ] Pagination for Pokémon list
- [ ] Search functionality
- [ ] Filter by type
- [ ] Evolution chains display
- [ ] Comparison feature
- [ ] Favorite Pokémon
- [ ] Move details modal
- [ ] Shiny forms toggle
- [ ] Sound effects
- [ ] Dark mode toggle

## 📚 Learn More

### API Documentation
- [PokéAPI Documentation](https://pokeapi.co/docs/v2)
- [@learningpad/api-client](https://www.npmjs.com/package/@learningpad/api-client)

### Framework Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
