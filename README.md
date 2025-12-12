# Chess Coach - Interactive Chess Training Platform

**Chess Coach** é uma plataforma completa de treino de xadrez inspirada no chess.com, permitindo aos jogadores treinar contra bots de diferentes níveis, um coach inteligente alimentado por IA, resolver puzzles temáticos, e analisar automaticamente suas partidas com marcadores detalhados.

## Características Principais

- **Jogo Interativo**: Tabuleiro de xadrez totalmente funcional com interface visual similar ao chess.com
- **Sistema de Bots**: 7 níveis de dificuldade (400-2800 rating) baseados no Stockfish com personalidades únicas
- **Coach IA**: Modo especial que combina Stockfish com ChatGPT para análise conversacional das jogadas
- **Análise Automática**: Análise pós-jogo com todos os marcadores (brilhante, excelente, bom, teoria, imprecisão, erro, capivarada)
- **Base de Dados de Puzzles**: Integração com Lichess com 6 temas diferentes (tática, estratégia, finais, abertura, xeque-mate, tática de peça)
- **Integração Chess.com**: Sincronização automática de ratings, histórico de partidas e perfil do jogador
- **Customização Visual**: Temas de tabuleiro e conjuntos de peças editáveis com imagens locais
- **Suporte Multilíngue**: Inglês e Português
- **Responsivo**: Totalmente otimizado para dispositivos móveis, tablets e desktop

## Instalação e Setup

### Pré-requisitos

- Node.js 22.13.0 ou superior
- pnpm 10.4.1 ou superior
- MySQL/TiDB para banco de dados
- Chaves API do ChatGPT (opcional, para modo coach)

### Passos de Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd chess-coach
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=mysql://user:password@localhost:3306/chess_coach
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OPENAI_API_KEY=sk-your-openai-key-here
```

4. **Configure o banco de dados**

```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Configuração e Customização

### Customizar Temas do Tabuleiro

Os temas do tabuleiro estão definidos em `shared/board-themes.ts`. Para adicionar um novo tema:

1. Abra `shared/board-themes.ts`
2. Adicione uma nova entrada ao objeto `BOARD_THEMES`:

```typescript
export const BOARD_THEMES: Record<string, BoardTheme> = {
  // ... temas existentes ...
  meuTema: {
    name: "meuTema",
    label: "Meu Tema",
    lightSquare: "#f0e6dd",  // Cor das casas claras (hex)
    darkSquare: "#b58863",   // Cor das casas escuras (hex)
    highlightSquare: "#baca44",  // Cor de destaque
    selectedSquare: "#7fc97f",   // Cor de seleção
  },
};
```

3. O tema estará imediatamente disponível nas configurações do aplicativo

### Customizar Conjuntos de Peças

Os conjuntos de peças são armazenados em `client/public/pieces/`. Para adicionar um novo conjunto:

1. Crie uma pasta em `client/public/pieces/{nome-do-conjunto}/`
2. Adicione arquivos SVG ou PNG com os nomes das peças:
   - Peças brancas: `wK.svg`, `wQ.svg`, `wR.svg`, `wB.svg`, `wN.svg`, `wP.svg`
   - Peças pretas: `bK.svg`, `bQ.svg`, `bR.svg`, `bB.svg`, `bN.svg`, `bP.svg`

3. Registre o conjunto em `shared/board-themes.ts`:

```typescript
export const PIECE_SETS: Record<string, PieceSet> = {
  // ... conjuntos existentes ...
  meuConjunto: {
    name: "meuConjunto",
    label: "Meu Conjunto",
    path: "/pieces/meuConjunto",
  },
};
```

### Configurar Prompts da IA

Os prompts utilizados pelo ChatGPT estão em `shared/ai-prompts.ts`. Você pode customizar:

- **Prompts do Coach**: Instruções para análise de jogadas
- **Prompts de Análise**: Instruções para análise pós-jogo
- **Prompts de Dificuldade**: Personalidades dos bots

Exemplo:

```typescript
export const AI_PROMPTS = {
  coachAnalysis: "Você é um treinador de xadrez experiente. Analise a seguinte jogada...",
  // ... mais prompts ...
};
```

### Integração com Chess.com

Para ativar a integração com Chess.com:

1. Adicione sua chave API do Chess.com ao arquivo `.env.local`:

```env
CHESSCOM_API_KEY=your-chess-com-api-key
```

2. Os utilizadores podem ligar suas contas Chess.com através do botão "Link Chess.com Account" no dashboard

3. As sincronizações ocorrem automaticamente:
   - Ratings são atualizados a cada 6 horas
   - Histórico de partidas é sincronizado diariamente
   - Dados do perfil são atualizados quando o utilizador faz login

### Integração com Lichess Puzzles

A integração com Lichess ocorre automaticamente. Para sincronizar puzzles manualmente:

```bash
node scripts/sync-lichess-puzzles.mjs
```

Para configurar sincronização periódica, edite `server/_core/index.ts` e adicione um cron job.

## Estrutura do Projeto

```
chess-coach/
├── client/                          # Frontend React
│   ├── public/
│   │   ├── pieces/                 # Conjuntos de peças customizáveis
│   │   │   ├── default/
│   │   │   ├── wooden/
│   │   │   └── ...
│   │   └── stockfish.js            # Worker do Stockfish
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.tsx        # Página inicial
│       │   ├── Play.tsx             # Página de jogo
│       │   ├── Puzzles.tsx          # Seletor de puzzles
│       │   ├── PuzzleGame.tsx       # Jogo de puzzle
│       │   ├── Analysis.tsx         # Análise de partida
│       │   └── Settings.tsx         # Configurações
│       ├── components/
│       │   ├── Chessboard.tsx       # Componente do tabuleiro
│       │   ├── CoachChat.tsx        # Chat do coach
│       │   ├── RatingChart.tsx      # Gráfico de ratings
│       │   └── ChessComLinkButton.tsx
│       └── lib/
│           └── stockfish.ts         # Wrapper do Stockfish
├── server/                          # Backend Express/tRPC
│   ├── chess-db.ts                 # Funções de banco de dados
│   ├── chess-routers.ts            # Rotas tRPC
│   ├── lichess-integration.ts      # Integração Lichess
│   ├── chesscom-sync.ts            # Sincronização Chess.com
│   └── analysis-engine.ts          # Motor de análise
├── shared/
│   ├── ai-prompts.ts               # Prompts da IA (EDITÁVEL)
│   ├── board-themes.ts             # Temas do tabuleiro (EDITÁVEL)
│   ├── translations.ts             # Traduções i18n
│   └── const.ts                    # Constantes
├── drizzle/
│   └── schema.ts                   # Schema do banco de dados
└── README.md                        # Este arquivo
```

## Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Utilizadores do sistema |
| `games` | Histórico de partidas |
| `game_analysis` | Análise de cada partida |
| `puzzles` | Base de dados de puzzles |
| `puzzle_themes` | Temas de puzzles |
| `user_puzzle_attempts` | Tentativas de puzzles por utilizador |
| `chesscom_profiles` | Perfis Chess.com sincronizados |
| `imported_games` | Partidas importadas do Chess.com |
| `user_settings` | Configurações do utilizador (temas, idioma) |
| `coach_chat_history` | Histórico de conversas com o coach |

### Executar Migrações

```bash
pnpm db:push
```

### Consultas SQL Customizadas

Para executar consultas SQL diretamente:

```bash
pnpm db:studio
```

## API Endpoints (tRPC)

### Procedures de Jogo

- `chess.createGame` - Criar nova partida
- `chess.makeMove` - Fazer jogada
- `chess.endGame` - Terminar partida
- `chess.getGame` - Obter dados da partida

### Procedures de Análise

- `chess.analyzeGame` - Analisar partida completa
- `chess.getMoveAnalysis` - Obter análise de uma jogada específica

### Procedures de Puzzles

- `chess.getPuzzles` - Obter puzzles com filtros
- `chess.solvePuzzle` - Submeter solução de puzzle
- `chess.getPuzzleStats` - Obter estatísticas de puzzles

### Procedures de Chess.com

- `chess.linkChessComAccount` - Ligar conta Chess.com
- `chess.syncChessComData` - Sincronizar dados Chess.com
- `chess.getChessComProfile` - Obter perfil Chess.com

## Chaves API Necessárias

### OpenAI (para Coach IA)

1. Aceda a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crie uma nova chave API
3. Adicione ao arquivo `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
```

### Chess.com (opcional)

1. Aceda a [https://www.chess.com/news/view/published-data-api](https://www.chess.com/news/view/published-data-api)
2. Siga as instruções para obter acesso à API pública
3. Não é necessária chave, mas pode configurar rate limiting

### Lichess (automático)

A integração Lichess utiliza a API pública e não requer chave API.

## Troubleshooting

### Problema: "Stockfish não está respondendo"

**Solução**: Verifique se o arquivo `client/public/stockfish.js` existe e está acessível. Pode fazer download em [https://github.com/nmrugg/stockfish.js](https://github.com/nmrugg/stockfish.js)

### Problema: "Erro ao conectar ao banco de dados"

**Solução**: Verifique a variável `DATABASE_URL` e certifique-se de que o servidor MySQL está em execução.

### Problema: "Ratings aparecem como N/A"

**Solução**: Isto é normal se a conta Chess.com não está ligada. Clique em "Link Chess.com Account" no dashboard.

### Problema: "Puzzles não carregam"

**Solução**: Execute `pnpm db:push` para garantir que as tabelas de puzzles existem, depois execute a sincronização Lichess.

## Customização de Símbolos de Modo de Jogo

Os símbolos dos modos de jogo (Rapid, Bullet, Blitz, etc.) podem ser facilmente customizados para corresponder ao seu design.

### Localização dos Símbolos

Os ícones dos modos de jogo estão definidos em `client/src/pages/Dashboard.tsx`. Pode utilizar qualquer ícone da biblioteca Lucide React ou adicionar símbolos personalizados.

### Modificar Símbolos Existentes

1. Abra `client/src/pages/Dashboard.tsx`
2. Localize a secção de `gameHistory` (aproximadamente linha 150-200)
3. Cada entrada de jogo tem um `modeIcon` que pode ser modificado:

```tsx
{
  mode: "Rapid",
  modeIcon: <Clock className="w-5 h-5 text-green-400" />,  // ← Modifique aqui
  opponent: "Player Name",
  // ...
}
```

### Ícones Disponíveis (Lucide React)

| Modo | Ícone Atual | Código | Alternativas |
|------|------------|--------|---------------|
| Rapid | 🕐 Clock | `<Clock />` | `<Timer />`, `<Hourglass />` |
| Bullet | 🔥 Flame | `<Flame />` | `<Zap />`, `<Rocket />` |
| Blitz | ⚡ Zap | `<Zap />` | `<Flame />`, `<Bolt />` |
| Chess960 | 🎲 Dice | `<Dice5 />` | `<Shuffle />`, `<Dices />` |
| Daily | ☀️ Sun | `<Sun />` | `<Calendar />`, `<Clock />` |

### Adicionar Ícones Personalizados

Se deseja usar ícones customizados (imagens SVG):

1. Coloque o arquivo SVG em `client/public/icons/`
2. Importe-o em `Dashboard.tsx`:

```tsx
import RapidIcon from '@/public/icons/rapid.svg';

// Depois use:
modeIcon: <img src={RapidIcon} alt="Rapid" className="w-5 h-5" />
```

### Modificar Cores dos Ícones

As cores estão definidas com classes Tailwind (ex: `text-green-400`). Pode alterá-las:

```tsx
// De:
<Clock className="w-5 h-5 text-green-400" />

// Para:
<Clock className="w-5 h-5 text-blue-500" />
```

Cores disponíveis: `text-red-400`, `text-green-400`, `text-blue-400`, `text-yellow-400`, `text-purple-400`, `text-pink-400`, etc.

## Performance e Otimizações

- **Caching**: As análises de Stockfish são cacheadas para melhorar performance
- **Lazy Loading**: Componentes são carregados sob demanda
- **Compressão**: Imagens de peças são otimizadas
- **CDN**: Recomenda-se usar um CDN para servir arquivos estáticos

## Roadmap Futuro

- [ ] Modo multiplayer em tempo real
- [ ] Torneios e competições
- [ ] Análise com IA em tempo real durante o jogo
- [ ] Integração com Lichess para jogar contra utilizadores reais
- [ ] Suporte para mais idiomas
- [ ] Aplicação mobile nativa
- [ ] Sistema de ranking global
- [ ] Transmissão ao vivo de partidas

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## Suporte

Para suporte, abra uma issue no repositório ou contacte através de [support@chesscoa ch.com](mailto:support@chesscoach.com).

## Autores

- **Manus AI** - Desenvolvimento inicial e arquitetura

## Agradecimentos

- [Stockfish](https://stockfishchess.org/) - Motor de xadrez
- [Chess.com](https://www.chess.com/) - Inspiração de design
- [Lichess](https://lichess.org/) - Base de dados de puzzles
- [OpenAI](https://openai.com/) - ChatGPT para análise IA

---

**Última atualização**: Dezembro 2024

Para mais informações, visite a documentação completa em `/docs`.
