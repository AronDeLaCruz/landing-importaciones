import { Course, QuizAnswerKey, QuizQuestion } from "./models";

export const courses: Course[] = [  
    { category: "Compras", title: "Importá desde cero",description:"De la idea al primer pedido: proveedores, costos y decisiones sin vueltas.", duration: "4 semanas", 
        level: "Inicial",    lessons: 12,    featured: true,  }, 
    {    category: "Logística",    title: "Logística internacional",    description:"Elegí rutas, medios de transporte y operadores con criterio profesional.", 
        duration: "3 semanas",    level: "Intermedio",    lessons: 9,  },  
    {    category: "Normativa",    title: "Aduana sin misterio", description: "Clasificación, documentación y procesos explicados con casos reales.", duration: "2 semanas", 
        level: "Inicial",    lessons: 8,  }, 
    { category: "Compras", title: "Negociación con proveedores", description: "Conseguí mejores condiciones y construí vínculos comerciales duraderos.", duration: "2 semanas",
        level: "Avanzado",    lessons: 7,  },
];

export const filters = ["Todos", "Compras", "Logística", "Normativa"] as const; 

export const quizSteps: { eyebrow: string; title: string; questions: QuizQuestion  [] }[] = [
   { eyebrow: "Tu punto de partida", title: "Contanos dónde estás hoy.",
    questions: [{ id: "stage", legend: "¿En qué etapa estás?", 
        options: [  { value: "idea", label: "Solo tengo una idea" }, 
                    { value: "research", label: "Ya investigué productos o proveedores", }, 
                    { value: "preparing", label: "Estoy preparando mi primera operación", }, 
                    { value: "experienced", label: "Ya realicé importaciones" }, ], }, 
                { id: "goal", legend: "¿Cuál es tu objetivo principal?", 
        options: [ { value: "start", label: "Empezar a importar desde cero" }, 
                   { value: "suppliers", label: "Mejorar costos y proveedores", }, 
                   { value: "logistics", label: "Ordenar la logística de mi operación", }, 
                   { value: "customs", label: "Entender requisitos y aduana",},],}, 
                ],}, 
   { eyebrow: "Tu principal desafío", title: "Identifiquemos qué te está frenando.", 
    questions: [ { id: "blocker", legend: "¿Qué es lo que más te frena hoy?", 
        options: [ { value: "suppliers", label: "Encontrar o negociar con proveedores", }, 
                   { value: "costs", label: "Calcular costos y saber si conviene", }, 
                   {            value: "logistics",            label: "Coordinar transporte y tiempos",          },          
                   {            value: "customs",            label: "Documentación y normativa aduanera",          }, ],      },
                ],  },  
   {    eyebrow: "Tu próximo paso",    title: "Pongámosle un horizonte a tu proyecto.",    
    questions: [      {        id: "timing",        legend: "¿Cuándo te gustaría avanzar?",        
        options: [          { value: "30-days", label: "En los próximos 30 días" },          
                { value: "3-months", label: "En los próximos 3 meses" }, 
                { value: "6-months", label: "En los próximos 6 meses" },
                { value: "exploring", label: "Todavía estoy explorando" },        ],      },    ],  },];

export const answerHeadings: Record<QuizAnswerKey, string> = {  stage: "Etapa actual",  goal: "Objetivo",  blocker: "Principal desafío",  timing: "Horizonte",};