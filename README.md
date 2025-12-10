# Carbone SteakHouse - Steakhouse Premium

Landing page premium com Tailwind CSS, lazy loading otimizado e Service Worker.

## Instalacao

### 1. Instalar dependencias
```bash
npm install
```

### 2. Executar em desenvolvimento
```bash
# Terminal 1 - compilar Tailwind CSS em tempo real
npm run dev

# Terminal 2 - iniciar servidor local
npm start
```

Aplicacao disponivel em `http://localhost:5500`.

## Deploy

### Build para producao
```bash
npm run build
```

Saida principal: `css/output.css` minificado.

### Opcoes de deploy

#### Vercel (recomendado)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### Servidor Apache/cPanel
1. Rode `npm run build` localmente.
2. Faça upload dos arquivos:
   - `html/`
   - `css/` (incluindo `output.css`)
   - `js/`
   - `assets/`
   - `index.html`
   - `.htaccess`
   - `robots.txt`
   - `sitemap.xml`

#### GitHub Pages
1. Push para GitHub.
2. Ative GitHub Pages nas configuracoes.
3. Deploy automatico.

## Estrutura do projeto

```
website-carbone/
├── html/
│   ├── index.html
│   ├── header.html
│   ├── hero.html
│   ├── section-*.html
│   └── footer.html
├── css/
│   ├── tailwind.css
│   ├── output.css
│   ├── global.css
│   └── premium.css
├── js/
│   ├── global.js
│   ├── header.js
│   ├── lazy-load.js
│   ├── service-worker.js
│   └── section-*.js
├── assets/
│   └── favicon.ico
├── .htaccess
├── robots.txt
├── sitemap.xml
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Recursos principais

- Design premium e elegante
- SEO otimizado (meta tags, sitemap)
- Lazy loading de imagens
- Service Worker (offline)
- Layout responsivo
- CSS minificado em producao
- Cache inteligente no navegador

## SEO checklist

- [x] Meta tags completas
- [x] Open Graph (OG)
- [x] Twitter Card
- [x] Sitemap XML
- [x] Robots.txt
- [x] Favicon
- [x] Canonical URL
- [x] Structured Data (Schema.org)
- [x] Hierarquia de headings
- [x] Alt text em imagens
- [x] Mobile-friendly

## Performance

O que ja esta implementado:
- Lazy loading com Intersection Observer
- Service Worker com cache estrategico
- GZIP no servidor
- Browser caching via .htaccess
- Preconnect/DNS Prefetch
- Imagens otimizadas

Metas esperadas:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse: 90+

## Contato e suporte

- Email: contato@carbonesteakhouse.com.br
- Telefone: (85) 3121-1614
- (85) 99251-3768

## Licenca

Desenvolvido por Otavio Cruz - 2025
