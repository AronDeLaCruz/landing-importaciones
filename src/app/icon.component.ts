import { Component, input } from "@angular/core";
import { IconName } from "./models";

@Component({
    selector: "app-icon",
    standalone: true,
    template: `
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"
            [attr.width]="size()" [attr.height]="size()"
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            [attr.stroke-width]="strokeWidth()">
            @switch (name()) {
                @case ('arrow') { <path d="M5 12h14" /><path d="m14 7 5 5-5 5" /> }
                @case ('check') { <path d="m5 12 4 4L19 6" /> }
                @case ('clock') { <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /> }
                @case ('box') { <path d="m4 7.5 8-4 8 4-8 4-8-4Z" /><path d="m4 7.5 8 4 8-4V17l-8 4-8-4V7.5Z" />
                    <path d="M12 11.5V21" /> }
                @case ("chevron") { <path d="m9 18 6-6-6-6" /> }
                @case ("document") { <path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h4M9 12h6M9 16h6" /> }
                @case ("globe") { <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />}
                @case ("mail") { <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" />}
                @case ("menu") { <path d="M4 7h16M4 12h16M4 17h16" /> }
                @case ("play") { <path d="m9 7 8 5-8 5V7Z" /> }
                @case ("plus") { <path d="M12 5v14M5 12h14" /> }
                @case ("spark") { <path d="M12 3c.7 4.2 2.8 6.3 7 7-4.2.7-6.3 2.8-7 7-.7-4.2-2.8-6.3-7-7 4.2-.7 6.3-2.8 7-7Z" /><path d="M19 16v5M16.5 18.5h5" />}
                @case ("users") { <circle cx="9" cy="8" r="3" /><path d="M3.5 19v-2a5.5 5.5 0 0 1 11 0v2M16 5.5a3 3 0 0 1 0 5.8M18 14a4 4 0 0 1 2.5 3.7V19" />}
            }
        </svg>
    `
})

export class IconComponent{
    name = input.required<IconName>();
    size = input(20);
    strokeWidth = input(1.8);
}