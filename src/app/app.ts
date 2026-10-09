import { Component, computed, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from './icon.component';
import { CourseCardComponent } from './course-card.component';
import { ImportQuizComponent } from './import-quiz.component';
import { courses, filters } from './data';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizState } from './quiz-state';

@Component({
  selector: 'app-root',
  imports: [IconComponent, CourseCardComponent, ImportQuizComponent], 
  templateUrl: './app.html',
})
export class App {
  private http = inject(HttpClient);
  quizState = inject(QuizState)

  chartBars = [42, 66, 48, 80, 57, 94, 74];
  filters = filters;
  allCourses = courses;
  activeFilter = signal<(typeof filters)[number]>('Todos');
  mobileOpen = signal(false);

  fields = signal(['Nombre completo', 'Correo electrónico']);
  values = signal<Record<string, string>>({});

  email = signal('');
  sent = signal(false);
  sending = signal(false);
  error = signal("");

  visibleCourses = computed(() =>
    this.activeFilter() === 'Todos'
      ? courses
      : courses.filter((c) => c.category === this.activeFilter()),
  );

  addField() {
    const available = ['Empresa', 'País de origen', 'Tipo de mercadería', 'Mensaje'];
    const next = available.find((f) => !this.fields().includes(f));
    if (next) this.fields.update((f) => [...f, next]);
  }

  builderSending = signal(false);
  builderSent = signal(false);
  builderError = signal('');

  details = computed(() =>
    this.fields()
      .map((label) => ({ label, value: (this.values()[label] ?? '').trim() }))
      .filter((f) => f.value),
  );

  setValue(label: string, value: string) {
    this.values.update((v) => ({ ...v, [label]: value }));
    this.builderSent.set(false); // si edita, puede volver a enviar
    this.builderError.set('');
  }
 
  inputType(label: string) {
    return label === 'Correo electrónico' ? 'email' : 'text';
  }

  private send(email: string) {
    return this.http.post('/api/contact', {
      email,
      details: this.details(),
      quiz: this.quizState.result(),
    });
  }
 
  // Botón "Publicar formulario": usa el campo "Correo electrónico" del generador
  publish() {
    if (this.builderSending()) return;
 
    const email = (this.values()['Correo electrónico'] ?? '').trim();
    if (!email) {
      this.builderError.set('Completá el campo "Correo electrónico" para poder responderte.');
      return;
    }
 
    this.builderSending.set(true);
    this.builderError.set('');
    this.send(email).subscribe({
      next: () => {
        this.builderSent.set(true);
        this.builderSending.set(false);
      },
      error: () => {
        this.builderError.set('No pudimos enviar el formulario. Revisá el correo e intentá de nuevo.');
        this.builderSending.set(false);
      },
    });
  }

  extrasNote = computed(() => {
    const parts: string[] = [];
    if (this.details().length) parts.push('los datos del formulario');
    if (this.quizState.result()) parts.push('tu resultado del test');
    return parts.length ? `Junto con tu correo enviaremos ${parts.join(' y ')}.` : '';
  });

  submit(event: Event){
    event.preventDefault();
    if (!this.email() || this.sending()) return;

    this.sending.set(true);
    this.error.set('');

    this.send(this.email()).subscribe({
      next: () => {
        this.sent.set(true);
        this.sending.set(false);
      },
      error: () => {
        this.error.set('No pudimos enviar tus datos. Probá de nuevo.');
        this.sending.set(false);
      },
    });
  }

}
