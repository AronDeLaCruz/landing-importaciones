import { afterNextRender, Component, computed, effect, ElementRef, inject, Injector, signal, viewChild } from "@angular/core";
import { IconComponent } from "./icon.component";
import { QuizAnswerKey, QuizAnswers } from "./models";
import { answerHeadings, quizSteps } from "./data";
import { getAnswerLabel, getQuizRecommendation } from "./quiz.logic";
import { QuizState } from "./quiz-state";

@Component({
    selector: "app-import-quiz",
    standalone: true,
    imports: [IconComponent],
    templateUrl: './import-quiz.component.html',
        
})

export class ImportQuizComponent{
    steps = quizSteps;
    headings = answerHeadings;
    headingKeys = Object.keys(answerHeadings) as QuizAnswerKey[];
    private quizState = inject(QuizState);
    getAnswerLabel = getAnswerLabel;

    step = signal(0);
    answers = signal<QuizAnswers>({});
    isComplete = signal(false);

    stepHeading = viewChild<ElementRef<HTMLHeadingElement>>('stepHeading');
    resultHeading = viewChild<ElementRef<HTMLHeadingElement>>('resultHeading');
    private hasInteracted = false;

    currentStep = computed(() => this.steps[this.step()]);
    canContinue = computed(() =>
        this.currentStep().questions.every((q) => this.answers()[q.id]),
    );
    recommendation = computed(() => getQuizRecommendation(this.answers()));
    progress = computed(() => Math.round(((this.step() + 1) / this.steps.length) * 100));

    constructor() {
        // equivalente al useEffect de foco
        effect(() => {
        this.isComplete(); this.step(); // dependencias
        if (!this.hasInteracted) return;
        afterNextRender(
            () => (this.isComplete() ? this.resultHeading() : this.stepHeading())
            ?.nativeElement.focus(),
            { injector: this.injector },
        );
        });
    }
    private injector = inject(Injector);

    select(id: QuizAnswerKey, value: string) {
        this.answers.update((a) => ({ ...a, [id]: value }));
    }

    moveToStep(n: number) { this.hasInteracted = true; this.step.set(n); }

    submit(e: Event) {
        e.preventDefault();
        if (!this.canContinue()) return;
        if (this.step() < this.steps.length - 1) return this.moveToStep(this.step() + 1);
        this.hasInteracted = true;

        this.quizState.result.set({
            recommendation: this.recommendation().title,
            type: this.recommendation().type,
            answers: this.headingKeys.map((k) => ({
                question: this.headings[k],
                answer: this.getAnswerLabel(k, this.answers()[k]),
            })),
        })

        this.isComplete.set(true);
    }

    restart() {
        this.hasInteracted = true;
        this.answers.set({});
        this.step.set(0);
        this.quizState.result.set(null);
        this.isComplete.set(false);
    }
}