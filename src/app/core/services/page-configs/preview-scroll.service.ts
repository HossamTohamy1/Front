import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface PreviewScrollTarget {
  sectionId?: string;
  sectionType?: string;
  selector?: string;
  index?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PreviewScrollService {
  private scrollToPreviewSubject = new Subject<PreviewScrollTarget>();
  private scrollToEditorSubject = new Subject<string | number>();
  private scrollToEditorTopSubject = new Subject<void>();

  readonly scrollToPreview$ = this.scrollToPreviewSubject.asObservable();
  readonly scrollToEditor$ = this.scrollToEditorSubject.asObservable();
  readonly scrollToEditorTop$ = this.scrollToEditorTopSubject.asObservable();

  /**
   * Instructs the Live Preview (phone/desktop mockup iframe) to smoothly scroll to a section.
   */
  scrollToSection(target: PreviewScrollTarget) {
    if (!target) return;
    this.scrollToPreviewSubject.next(target);
  }

  /**
   * Instructs the editor panel on the right to smoothly scroll to a section card.
   */
  scrollToEditor(sectionIdOrIndex: string | number) {
    if (sectionIdOrIndex === undefined || sectionIdOrIndex === null) return;
    this.scrollToEditorSubject.next(sectionIdOrIndex);
  }

  /**
   * Smoothly scrolls the dashboard editor container and viewport to the top.
   * Brings opened edit forms, modals, and drawers directly into view.
   */
  scrollToEditorTop() {
    this.scrollToEditorTopSubject.next();
    if (typeof document !== 'undefined') {
      const editorContainer = document.getElementById('lk-editor-scroll-container')
        || document.querySelector('.custom-scrollbar.overflow-y-auto')
        || document.querySelector('.custom-scrollbar');
      if (editorContainer) {
        editorContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }

      const parent = editorContainer?.closest('.overflow-y-auto');
      if (parent && parent !== editorContainer) {
        parent.scrollTo({ top: 0, behavior: 'smooth' });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
