import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const line = (v: unknown, max = 200) =>
  typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }
 
    const body = req.body ?? {};
    
    const email = line(body.email, 150);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Correo inválido' });
    }
 
    // Campos del generador de formularios: [{ label, value }]
    const details: [string, string][] = (Array.isArray(body.details) ? body.details : [])
        .slice(0, 10)
        .map((d: any): [string, string] => [line(d?.label, 60), line(d?.value, 500)])
        .filter(([label, value]: [string, string]) => label && value);
    
    const name = details.find(([label]) => label === 'Nombre completo')?.[1];
    
    // Resultado del quiz
    const quiz = body.quiz;
    const quizLines =
        quiz && Array.isArray(quiz.answers)
        ? [
            '--- Resultado del test ---',
            `Recomendación: ${line(quiz.recommendation)} (${line(quiz.type)})`,
            ...quiz.answers
                .slice(0, 6)
                .map((a: any) => `${line(a?.question, 60)}: ${line(a?.answer, 120)}`),
            ]
        : [];
    
    const text = [
        `Correo: ${email}`,
        details.length
        ? ['--- Datos del formulario ---', ...details.map(([k, v]) => `${k}: ${v}`)].join('\n')
        : '',
        quizLines.join('\n'),
    ]
        .filter(Boolean)
        .join('\n\n');
    
    const { error } = await resend.emails.send({
        from: 'OTI Web <onboarding@resend.dev>',
        to: process.env.CONTACT_TO!,
        replyTo: email,
        subject: `Nuevo contacto: ${name ?? email}`,
        text,
    });
    
    if (error) return res.status(502).json({ error: 'No se pudo enviar' });
    return res.status(200).json({ ok: true });
}