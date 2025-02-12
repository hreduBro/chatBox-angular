# ChatBoxGpt

This project was generated using [Angular CLI] version 19.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

# Documentation for `onSubmit` Function

## Overview
The `onSubmit` function is responsible for handling user input, updating chat history, and simulating a response with Markdown-formatted content. It is implemented in `src/landing/landing.component.ts`.

## Functionality
1. **Disables the loader** (`this.loader.set(false)`).
2. **Adds user input to history** (`this.history.push(obj)`).
3. **Clears the prompt** (`this.prompt = null`).
4. **Updates chat history state** (`this.chatHistory.set(this.history)`).
5. **Handles UI focus and disables text area**.
6. **Sets generating state to `true`** (`this.generating.set(true)`).
7. **Simulates a response with `setTimeout`**, adding a Markdown-formatted example.
8. **Updates history with response** and **restores focus**.

## Code Snippet

```typescript
onSubmit() {
    this.loader.set(false);
    let obj = { context: this.prompt };
    this.history.push(obj);
    this.prompt = null;
    this.chatHistory.set(this.history);
    this.textArea.nativeElement.blur();
    this.textArea.nativeElement.disabled;
    this.generating.set(true);

    setTimeout(() => {
      let obj = {
        response: `# Sample Markdown\n\n### Code Example (SQL)\n\n\`\`\`sql\nCREATE TABLE Users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100) UNIQUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nINSERT INTO Users (id, name, email) VALUES (1, 'John Doe', 'john@example.com');\nSELECT * FROM Users;\n\`\`\`\n\n### Table Example\n\n| ID  | Name     | Email             | Created At          |\n| --- | -------- | ---------------- | ------------------- |\n| 1   | John Doe | john@example.com | 2024-02-13 12:00:00 |\n      `
      };
      this.history.push(obj);
      this.chatHistory.set(this.history);
      this.generating.set(false);
      this.textArea.nativeElement.focus();
      requestAnimationFrame(() => this.scrollToBottom());
    }, 2000);
}
```

## Alternative Implementation: Using an HTTP Call
Instead of using `setTimeout`, you can fetch Markdown content from a remote API using Angular's `HttpClient`.

### Steps to Modify:
1. **Inject `HttpClient` in the constructor** (if not already injected).
2. **Replace `setTimeout` with an HTTP GET request**.
3. **Update the history with the fetched response**.

### Modified Code:
```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

onSubmit() {
    this.loader.set(false);
    let obj = { context: this.prompt };
    this.history.push(obj);
    this.prompt = null;
    this.chatHistory.set(this.history);
    this.textArea.nativeElement.blur();
    this.textArea.nativeElement.disabled;
    this.generating.set(true);

    this.http.get<{ response: string }>('https://api.example.com/markdown-response').subscribe(
      (data) => {
        let obj = { response: data.response };
        this.history.push(obj);
        this.chatHistory.set(this.history);
        this.generating.set(false);
        this.textArea.nativeElement.focus();
        requestAnimationFrame(() => this.scrollToBottom());
      },
      (error) => {
        console.error('Error fetching response:', error);
        this.generating.set(false);
      }
    );
}
```

## Summary
- The original implementation uses `setTimeout` to simulate a delay.
- The improved version fetches real data from an API.
- This change allows dynamic updates from a remote source.

## File Path
Modify the following file:
```
src/landing/landing.component.ts
```



Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

# chatBox-angular
