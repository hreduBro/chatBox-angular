import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  SecurityContext,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal
} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatRadioModule} from "@angular/material/radio";
import {NgClass, NgIf} from "@angular/common";
import {MatRipple} from "@angular/material/core";
import {MarkdownModule, MarkdownService} from 'ngx-markdown';


declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatRadioModule,
    NgIf,
    NgClass,
    MatRipple,
    MarkdownModule
  ],
  providers: [
    MarkdownService,
    {provide: SecurityContext, useValue: SecurityContext.NONE} // ✅ Fix: Provide SECURITY_CONTEXT
  ],
  styleUrls: ['landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  public chatHistory: WritableSignal<any[]> = signal([]);
  public loader: WritableSignal<boolean> = signal(true);
  public generating: WritableSignal<boolean> = signal(false);
  history: any[] = []
  prompt: string | any;
  recognition: any;

  constructor(
    private ngZone: NgZone,
    public cdr: ChangeDetectorRef
  ) {
    this.initializeSpeechRecognition();
  }


  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.ngZone.run(() => {
          this.prompt = transcript;
          this.textArea.nativeElement.focus();
          this.cdr.detectChanges()
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  ngOnInit() {

  }


  onListen() {
    if (this.recognition) {
      this.recognition.start();
    } else {
      alert('Your browser does not support speech recognition.');
    }
  }

  onEnter(event: KeyboardEvent | any) {
    if (!event.shiftKey && !this.generating()) {
      event.preventDefault(); // Prevents new line
      this.onSubmit();
    }
  }

  onSubmit() {
    this.loader.set(false)
    let obj = {context: this.prompt}
    this.history.push(obj)
    this.prompt = null
    this.chatHistory.set(this.history)
    this.textArea.nativeElement.blur();
    this.textArea.nativeElement.disabled;
    this.generating.set(true);
    setTimeout(() => {
      let obj = {
        response: `# Sample Markdown

### Code Example (SQL)
\`\`\`sql
CREATE TABLE Users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (id, name, email) VALUES (1, 'John Doe', 'john@example.com');
SELECT * FROM Users;
\`\`\`

### Table Example

| ID  | Name     | Email             | Created At          |
| --- | -------- | ---------------- | ------------------- |
| 1   | John Doe | john@example.com | 2024-02-13 12:00:00 |
`
      };
      this.history.push(obj)
      this.chatHistory.set(this.history)
      this.generating.set(false);
      this.textArea.nativeElement.focus();
      requestAnimationFrame(() => this.scrollToBottom());
    }, 2000);
  }


  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

}
