# Estructura del Proyecto Vitaria (Frontend React)

```
Vitaria/
├── public/                 # Assets estáticos públicos (favicon, manifest.json, icons)
├── src/
│   ├── assets/             # Imágenes, fuentes, iconos locales
│   │   ├── icons/
│   │   └── images/
│   ├── components/         # Componentes reutilizables
│   │   ├── common/         # Botones, Inputs, Cards genéricos
│   │   ├── layout/         # Layout principal, Sidebar, Navbar
│   │   ├── goals/          # Componentes específicos de Metas
│   │   ├── habits/         # Componentes específicos de Hábitos
│   │   ├── finance/        # Componentes específicos de Finanzas
│   │   └── journal/        # Componentes específicos de Diario
│   ├── contexts/           # React Contexts (AuthContext, ThemeContext)
│   ├── hooks/              # Custom Hooks (useAuth, useGoals, etc.)
│   ├── lib/                # Configuración de librerías (supabaseClient.ts, utils.ts)
│   ├── pages/              # Páginas principales (Rutas)
│   │   ├── Dashboard.tsx
│   │   ├── Goals.tsx
│   │   ├── Habits.tsx
│   │   ├── Finance.tsx
│   │   ├── Journal.tsx
│   │   ├── Planner.tsx
│   │   ├── MealPlan.tsx
│   │   └── Profile.tsx
│   ├── services/           # Llamadas a la API / Supabase
│   ├── types/              # Definiciones de tipos TypeScript
│   ├── App.tsx             # Componente raíz con Rutas
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales y directivas de Tailwind
├── .env                    # Variables de entorno (VITE_SUPABASE_URL, etc.)
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
