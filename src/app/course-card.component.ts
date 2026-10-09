import { Component, computed, input } from "@angular/core";
import { IconComponent } from "./icon.component";
import { Course } from "./models";

@Component({
    selector: "app-course-card",
    standalone: true,
    imports: [IconComponent],
    template: `
        <article class="course-card" [class]="tone()">
        <div class="course-card__top">
            <span class="course-category">{{ course().category }}</span>
            <span class="course-number">0{{ index() + 1 }}</span>
        </div>
        <div>
            @if (course().featured) { <span class="popular-pill">Más elegido</span> }
            <h3>{{ course().title }}</h3>
            <p>{{ course().description }}</p>
        </div>
        <div class="course-meta">
            <span><app-icon name="clock" [size]="16" /> {{ course().duration }}</span>
            <span>{{ course().lessons }} clases</span>
            <span>{{ course().level }}</span>
        </div>
        <a class="course-link" type="button" href="#contacto">
            Ver programa <app-icon name="arrow" [size]="18" />
        </a>
        </article>
    `,  
})

export class CourseCardComponent{
    course = input.required<Course>();
    index = input.required<number>();
    private tones = ['tone-coral', 'tone-blue', 'tone-lime', 'tone-cream'];
    tone = computed(() => `course-card ${this.tones[this.index() % this.tones.length]}`);
}