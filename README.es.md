<p align="right">🌐 <a href="README.md">English</a> | <b>Español</b></p>

# OTI Importaciones

Landing page para un negocio de consultoría en importaciones. Incluye un test interactivo que recomienda un curso o servicio, un catálogo de cursos, una demo de generador de formularios y un flujo de contacto con una función serverless que envía por correo cada contacto junto con el resultado de su test.

**Demo en vivo:** _agregá el enlace después de desplegar_

## Funcionalidades

- **Test de orientación:** 4 preguntas en 3 pasos, con barra de progreso accesible y manejo del foco. Recomienda un curso o un servicio según las respuestas.
- **Catálogo de cursos:** filtrable por categoría (Compras, Logística, Normativa).
- **Generador de formularios:** se pueden agregar y completar campos, y los datos viajan con la solicitud de contacto.
- **Flujo de contacto serverless:** el correo se envía desde una Vercel Function usando Resend, así la API key nunca llega al navegador.
- **Diseño responsive** con una hoja de estilos global y variables CSS.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular (componentes standalone, signals, nuevo control flow) + TypeScript |
| Backend | Vercel Functions (Node.js, TypeScript) |
| Correo | [Resend](https://resend.com) |
| Hosting | Vercel |

## Estructura del proyecto

```
api/
  contact.ts            # Función serverless: valida la petición y envía el correo
src/
  app/
    app.ts / app.html   # Componente raíz: hero, servicios, generador, cursos, CTA de contacto
    import-quiz.*       # Componente del test
    course-card.*       # Componente de tarjeta de curso
    icon.component.ts   # Componente de íconos SVG
    quiz-state.ts       # Servicio compartido: el resultado del test llega al formulario de contacto
    data.ts             # Cursos, filtros y preguntas del test
  styles.css            # Estilos globales
```

## Cómo funciona el flujo de contacto

```
Test ──► QuizState (signal compartida)
                              │
Campos del generador ─────────┤
                              ▼
Formulario CTA (correo) ──► POST /api/contact ──► Vercel Function ──► Resend ──► bandeja
```

`POST /api/contact` espera un JSON:

```json
{
  "email": "ana@empresa.com",
  "details": [
    { "label": "Nombre completo", "value": "Ana Pérez" },
    { "label": "Empresa", "value": "Textiles Sur" }
  ],
  "quiz": {
    "recommendation": "Logística internacional",
    "type": "Curso recomendado",
    "answers": [
      { "question": "Etapa actual", "answer": "Ya investigué productos o proveedores" }
    ]
  }
}
```

`details` y `quiz` son opcionales. Solo `email` es obligatorio.

| Estado | Significado |
|---|---|
| `200` | Correo enviado |
| `400` | Correo inválido |
| `405` | Método no permitido (solo `POST`) |
| `502` | Resend rechazó la petición |

Todo lo que llega se trata como no confiable: se recorta, se limita su longitud, se eliminan los saltos de línea (para evitar inyección de encabezados) y se envía como texto plano.

## Cómo empezar

### Requisitos

- Node.js 20 o superior (recomendado 22 LTS)
- Una cuenta de [Resend](https://resend.com) y una API key
- Una cuenta de [Vercel](https://vercel.com) (el plan gratuito alcanza)

### Instalación

```bash
git clone https://github.com/<tu-usuario>/oti-importaciones.git
cd oti-importaciones
npm install
```

### Variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto:

```
RESEND_API_KEY=re_tu_clave_real
CONTACT_TO=tu@correo.com
```

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de Resend (empieza con `re_`) |
| `CONTACT_TO` | Bandeja que recibe los correos de contacto |

> Mientras no verifiques tu propio dominio en Resend, solo podés enviar desde `onboarding@resend.dev` y únicamente al correo con el que te registraste.

Nunca subas `.env` ni `.env.local` al repositorio: los dos deben estar en `.gitignore`. Si una clave se expone, revocala en Resend y creá otra.

### Ejecutar en local

`ng serve` no ejecuta la carpeta `api/`, así que usá la CLI de Vercel para correr el frontend y la función juntos:

```bash
npx vercel dev
```

La primera vez te pide iniciar sesión y enlazar la carpeta con un proyecto de Vercel (elegí **Create a new project**). Después la app queda disponible en `http://localhost:3000`.

También podés probar la función por separado:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"prueba@ejemplo.com"}'
```

### Solución de problemas

- **`Header "host" ... is not allowed`:** el servidor de desarrollo de Angular rechaza el host que reenvía `vercel dev`. Agregalo en `angular.json`, dentro de `serve > options`:
  ```json
  "allowedHosts": ["localhost", "127.0.0.1", "::1", "[::1]"]
  ```
- **`API key is invalid` (401 de Resend):** la función está leyendo un valor de ejemplo o desactualizado. Verificá que `.env` y `.env.local` no se contradigan y reiniciá `vercel dev` después de editarlos.
- **Faltan estilos en los componentes hijos:** la hoja de estilos tiene que ser global (`src/styles.css` registrado en `angular.json`), no un `styleUrl` de componente, que Angular encapsula.

## Despliegue

1. Cargá `RESEND_API_KEY` y `CONTACT_TO` en **Vercel > Settings > Environment Variables**. El `.env.local` local no se sube.
2. Configurá el **Output Directory** como `dist/<nombre-del-proyecto>/browser`.
3. Desplegá:

```bash
npx vercel --prod
```

Para producción, verifica tu dominio en Resend y cambiá la dirección `from` en `api/contact.ts`. Así además podés enviar a cualquier destinatario y desaparece la etiqueta "External" en las bandejas.
