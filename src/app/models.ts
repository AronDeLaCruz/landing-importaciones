export type Course = {
    category: "Compras" | "Logística" | "Normativa";  
    title: string;  
    description: string;  
    duration: string;  
    level: string;  lessons: number;  featured?: boolean;
}

export type IconName  =  | "arrow"  | "box"  | "check"  | "chevron"  | "clock"  | "document"  | "globe"  | "mail"  | "menu"  | "play"  | "plus"  | "spark"  | "users";

export type QuizOption = {  value: string;  label: string;};

export type QuizAnswerKey = "stage" | "goal" | "blocker" | "timing"; 

export type QuizQuestion = {
    id: QuizAnswerKey;  legend: string;  options: QuizOption[];
}

export type QuizAnswers = Partial<Record<QuizAnswerKey, string>>;

export type QuizRecommendation = {  
    title: string;  
    type: "Curso recomendado" | "Servicio recomendado";  description: string; 
     href: "#cursos" | "#contacto";  cta: string;  
    tone: "blue" | "coral" | "lime";
};