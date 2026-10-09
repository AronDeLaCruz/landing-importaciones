import { quizSteps } from "./data";
import { QuizAnswerKey, QuizAnswers, QuizRecommendation } from "./models";

export const answerHeadings: Record<QuizAnswerKey, string> = { 
    stage: "Etapa actual",  goal: "Objetivo",  blocker: "Principal desafío",  timing: "Horizonte",
}; 

export function getAnswerLabel(key: QuizAnswerKey, value?: string) { 
    const question = quizSteps.flatMap((step) => step.questions).find(
        (item) => item.id === key);   
        return question?.options.find((option) => option.value === value)?.label ?? "";
} 

export function getQuizRecommendation(answers: QuizAnswers): QuizRecommendation { 
    if (answers.blocker === "customs") {
        return { title: "Aduana sin misterio", type: "Curso recomendado", 
            description: "Tu principal desafío está en la documentación. Este curso te da una base clara para clasificar, documentar y avanzar con más seguridad.",
            href: "#cursos",      cta: "Ver curso recomendado", tone: "blue", 
        };  
    }  
    
    if ( (answers.stage === "preparing" || answers.stage === "experienced") && answers.timing === "30-days" ) {
        return { title: "Gestión de importaciones", type: "Servicio recomendado", 
            description: "Ya estás cerca de operar y tu plazo es concreto. El acompañamiento integral de OTI puede ayudarte a coordinar cada etapa sin perder tiempo.",
            href: "#contacto", cta: "Hablar con OTI", tone: "coral", 
        };  
    }   
    
    if (answers.goal === "customs") { 
        return { title: "Aduana sin misterio", type: "Curso recomendado", 
            description: "Querés entender los requisitos antes de avanzar. Este curso convierte la normativa y la documentación en decisiones concretas.",
            href: "#cursos",      cta: "Ver curso recomendado",      tone: "blue",    
        }; 
    }   
    
    if (answers.blocker === "logistics" || answers.goal === "logistics") {    
        return { title: "Logística internacional", type: "Curso recomendado", 
            description: "Tu oportunidad está en ordenar rutas, tiempos y operadores. Este curso te ayuda a planificar la logística con criterio profesional.",
            href: "#cursos",      cta: "Ver curso recomendado",      tone: "blue",
        };
    };

    if ( answers.blocker === "suppliers" || answers.blocker === "costs" ||    answers.goal === "suppliers"  ) {
        return {      
            title: "Negociación con proveedores",      type: "Curso recomendado",
            description: "Necesitás ganar claridad sobre proveedores y costos. Este curso te prepara para negociar mejores condiciones y evaluar oportunidades reales.",
            href: "#cursos",      cta: "Ver curso recomendado",      tone: "lime", 
        };  
    } 
    
    return { title: "Importaciones desde cero",    type: "Curso recomendado",
        description: "Estás construyendo las bases de tu proyecto. Este curso te acompaña desde la idea hasta un primer pedido bien pensado.",
        href: "#cursos",    cta: "Ver curso recomendado",    tone: "coral",  
    };
}