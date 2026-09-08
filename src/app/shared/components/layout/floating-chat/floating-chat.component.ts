import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, ElementRef, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="customer-floating-chat" dir="rtl">
      @if (isOpen) {
        <section
          class="customer-floating-chat__panel"
          role="dialog"
          aria-modal="false"
          aria-label='SHARED.AUTO_STR_27'
        >
          <header class="customer-floating-chat__header">
            <div class="customer-floating-chat__support">
              <span class="customer-floating-chat__support-icon" aria-hidden="true">
                <lucide-icon name="message-circle" [size]="20" [strokeWidth]="2"></lucide-icon>
              </span>
              <div>
                <strong>{{ 'SHARED.AUTO_STR_72' | translate }}</strong>
                <span [class]="isSupportActive ? 'is-active' : 'is-recent'">
                  <i aria-hidden="true"></i>
                  {{ isSupportActive ? 'SHARED.AUTO_STR_76' : 'SHARED.AUTO_STR_66' }}
                </span>
              </div>
            </div>

            <div class="customer-floating-chat__header-actions">
              <button
                type="button"
                [class.is-active]="isSearchOpen"
                (click)="toggleSearch()"
                aria-label='SHARED.AUTO_STR_37'
              >
                <lucide-icon name="search" [size]="18" [strokeWidth]="2"></lucide-icon>
              </button>
              <button type="button" (click)="setIsOpen(false)" aria-label='SHARED.AUTO_STR_47'>
                <lucide-icon name="x" [size]="20" [strokeWidth]="2"></lucide-icon>
              </button>
            </div>
          </header>

          @if (isSearchOpen) {
            <label class="customer-floating-chat__message-search">
              <lucide-icon name="search" [size]="16"></lucide-icon>
              <input
                [(ngModel)]="messageSearch"
                placeholder="Ø§Ø¨Ø­Ø«ÙŠ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø±Ø³Ø§Ø¦Ù„..."
                autofocus
              />
              @if (normalizedMessageSearch) {
                <span>{{ searchResultCount }} Ù†ØªÙŠØ¬Ø©</span>
              }
              @if (messageSearch) {
                <button type="button" (click)="messageSearch = ''" aria-label='SHARED.AUTO_STR_73'>
                  <lucide-icon name="x" [size]="15"></lucide-icon>
                </button>
              }
            </label>
          }

          <div #messagesRef class="customer-floating-chat__messages">
            <span class="customer-floating-chat__day">{{ 'SHARED.AUTO_STR_95' | translate }}</span>

            @if (messages.length === 0) {
              <div class="customer-floating-chat__welcome">
                <lucide-icon name="message-circle" [size]="34" [strokeWidth]="1.6"></lucide-icon>
                <strong>{{ 'SHARED.AUTO_STR_7' | translate }}</strong>
                <p>Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„ØªÙƒ ÙˆØ³ÙŠÙ‚ÙˆÙ… Ø£Ø­Ø¯ Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ† Ø¨Ø§Ù„Ø±Ø¯ Ø¹Ù„ÙŠÙƒ.</p>
              </div>
            } @else {
              @for (message of messages; track message.id) {
                <div
                  class="customer-floating-chat__message-row"
                  [ngClass]="{
                    'customer-floating-chat__message-row--customer': message.sender === 'customer',
                    'customer-floating-chat__message-row--staff': message.sender === 'staff',
                    'is-search-dim': normalizedMessageSearch && !isSearchMatch(message),
                    'is-search-match': normalizedMessageSearch && isSearchMatch(message)
                  }"
                  [attr.data-search-match]="normalizedMessageSearch && isSearchMatch(message) ? 'true' : 'false'"
                >
                  <div class="customer-floating-chat__message" [ngClass]="'customer-floating-chat__message--' + message.sender">
                    @if (message.sender === 'staff') {
                      <small>{{ 'SHARED.AUTO_STR_72' | translate }}</small>
                    }
                    @if (message.forwarded) {
                      <em class="customer-floating-chat__forwarded">â†ª Ù…ÙØ¹Ø§Ø¯ ØªÙˆØ¬ÙŠÙ‡Ù‡Ø§</em>
                    }

                    @if (message.replyTo) {
                      <button
                        type="button"
                        class="customer-floating-chat__reply-preview"
                        (click)="scrollToMessage(message.replyTo.messageId)"
                      >
                        <strong>{{ message.replyTo.sender === 'staff' ? 'SHARED.AUTO_STR_72' : 'SHARED.AUTO_STR_111' }}</strong>
                        <span>{{ message.replyTo.preview }}</span>
                      </button>
                    }

                    <div class="customer-floating-chat__bubble" [attr.data-message-id]="message.id">
                      @if (message.deletedForEveryone) {
                        <p class="customer-floating-chat__deleted">{{ 'SHARED.AUTO_STR_32' | translate }}</p>
                      } @else {
                        @if (messageKind(message) === 'image' && message.mediaUrl) {
                          <button
                            type="button"
                            class="customer-floating-chat__image"
                            (click)="openImage(message.mediaUrl)"
                          >
                            <img [src]="message.mediaUrl" [alt]="message.fileName || 'SHARED.AUTO_STR_70'" />
                          </button>
                        }
                        @if (messageKind(message) === 'audio' && message.mediaUrl) {
                          <audio class="customer-floating-chat__audio" controls preload="metadata" [src]="message.mediaUrl"></audio>
                        }
                        @if (message.text) {
                          <p>{{ message.text }}</p>
                        }
                      }
                    </div>

                    <span class="customer-floating-chat__message-meta">
                      @if (message.editedAt) {
                        <i>{{ 'SHARED.AUTO_STR_96' | translate }}</i>
                      }
                      {{ message.sentAt }}
                      @if (message.sender === 'customer') {
                        <lucide-icon name="check-check" [size]="14" [strokeWidth]="1.8"></lucide-icon>
                      }
                    </span>

                    @if (aggregateReactions(message).length > 0) {
                      <div class="customer-floating-chat__reactions">
                        @for (reaction of aggregateReactions(message); track reaction.emoji) {
                          <button type="button" (click)="reactToMessage(message, reaction.emoji)">
                            {{ reaction.emoji }} <span>{{ reaction.count }}</span>
                          </button>
                        }
                      </div>
                    }
                  </div>

                  @if (!message.deletedForEveryone) {
                    <div class="customer-floating-chat__message-controls">
                      <button
                        type="button"
                        (click)="toggleMenu(message.id)"
                        aria-label='SHARED.AUTO_STR_48'
                      >
                        <lucide-icon name="more-horizontal" [size]="17"></lucide-icon>
                      </button>

                      @if (menuMessageId === message.id) {
                        <div class="customer-floating-chat__message-menu">
                          <button type="button" (click)="chooseReply(message)">
                            <lucide-icon name="reply" [size]="15"></lucide-icon>{{ 'SHARED.AUTO_STR_118' | translate }}</button>
                          <button type="button" (click)="toggleReaction(message.id)">
                            <lucide-icon name="smile" [size]="15"></lucide-icon>{{ 'SHARED.AUTO_STR_97' | translate }}</button>
                          <button type="button" (click)="copyMessage(message)">
                            <lucide-icon name="copy" [size]="15"></lucide-icon>{{ 'SHARED.AUTO_STR_115' | translate }}</button>
                          @if (message.sender === 'customer' && messageKind(message) === 'text') {
                            <button type="button" (click)="chooseEdit(message)">
                              <lucide-icon name="edit-3" [size]="15"></lucide-icon>{{ 'COMMON.EDIT' | translate }}</button>
                          }
                          <button
                            type="button"
                            class="is-danger"
                            (click)="prepareDelete(message)"
                          >
                            <lucide-icon name="trash-2" [size]="15"></lucide-icon>{{ 'COMMON.DELETE' | translate }}</button>
                        </div>
                      }

                      @if (reactionMessageId === message.id) {
                        <div class="customer-floating-chat__reaction-picker">
                          @for (emoji of REACTION_OPTIONS; track emoji) {
                            <button type="button" (click)="reactToMessage(message, emoji)">
                              {{ emoji }}
                            </button>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>

          @if (replyMessage || editMessage) {
            <div class="customer-floating-chat__composer-context">
              <div>
                <strong>{{ editMessage ? 'SHARED.AUTO_STR_54' : 'SHARED.AUTO_STR_40' }}</strong>
                <span>{{ getPreview(editMessage || replyMessage) | slice:0:90 }}</span>
              </div>
              <button type="button" (click)="clearComposerMode()" aria-label='COMMON.CANCEL'>
                <lucide-icon name="x" [size]="17"></lucide-icon>
              </button>
            </div>
          }

          @if (isRecording) {
            <div class="customer-floating-chat__recording-bar">
              <span><i ></i> Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ {{ formatRecordingTime(recordingSeconds) }}</span>
              <button type="button" (click)="stopRecording()">{{ 'SHARED.AUTO_STR_59' | translate }}</button>
            </div>
          }

          <form class="customer-floating-chat__composer" (submit)="sendTextMessage($event)">
            <input
              #imageInput
              type="file"
              accept="image/*"
              hidden
              (change)="handleImageSelected($event)"
            />
            <button
              type="button"
              class="customer-floating-chat__tool"
              (click)="imageInput.click()"
              aria-label='SHARED.AUTO_STR_71'
              [disabled]="isRecording"
            >
              <lucide-icon name="image" [size]="19"></lucide-icon>
            </button>
            <button
              type="button"
              class="customer-floating-chat__tool"
              [class.is-recording]="isRecording"
              (click)="isRecording ? stopRecording() : startRecording()"
              [attr.aria-label]="isRecording ? 'SHARED.AUTO_STR_20' : 'SHARED.AUTO_STR_38'"
            >
              @if (isRecording) {
                <lucide-icon name="square" [size]="17" fill="currentColor"></lucide-icon>
              } @else {
                <lucide-icon name="mic" [size]="19"></lucide-icon>
              }
            </button>
            <textarea
              #inputRef
              [(ngModel)]="messageValue"
              name="messageValue"
              [placeholder]="editMessage ? 'Ø¹Ø¯Ù„ÙŠ Ø§Ù„Ø±Ø³Ø§Ù„Ø©...' : 'Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„ØªÙƒ Ù‡Ù†Ø§...'"
              aria-label='DASHBOARD.AUTO_STR_348'
              rows="1"
              [disabled]="isRecording"
              (keydown)="onTextareaKeyDown($event)"
            ></textarea>
            <button
              type="submit"
              class="customer-floating-chat__send"
              [disabled]="!messageValue.trim() || isRecording"
              [attr.aria-label]="editMessage ? 'SHARED.AUTO_STR_67' : 'SHARED.AUTO_STR_55'"
            >
              @if (editMessage) {
                <lucide-icon name="check-check" [size]="20"></lucide-icon>
              } @else {
                <lucide-icon name="send" [size]="20" [strokeWidth]="2"></lucide-icon>
              }
            </button>
          </form>

          @if (deleteMessage) {
            <div
              class="customer-floating-chat__modal-backdrop customer-floating-chat__modal-backdrop--delete"
              role="presentation"
            >
              <section class="customer-floating-chat__delete-modal" role="dialog" aria-modal="true">
                <button
                  type="button"
                  class="customer-floating-chat__modal-close"
                  (click)="deleteMessage = null"
                  aria-label='SHARED.AUTO_STR_33'
                >
                  <lucide-icon name="x" [size]="18"></lucide-icon>
                </button>
                <strong>{{ 'SHARED.AUTO_STR_61' | translate }}</strong>
                <p>{{ 'SHARED.AUTO_STR_5' | translate }}</p>
                <button type="button" class="is-danger" (click)="confirmDelete('me')">{{ 'SHARED.AUTO_STR_74' | translate }}</button>
                <button type="button" class="is-danger" (click)="confirmDelete('everyone')">{{ 'SHARED.AUTO_STR_41' | translate }}</button>
                <button type="button" (click)="deleteMessage = null">{{ 'COMMON.CANCEL' | translate }}</button>
              </section>
            </div>
          }

        </section>
      }

      <button
        type="button"
        class="customer-floating-chat__trigger"
        [class.is-open]="isOpen"
        (click)="toggleChat()"
        [attr.aria-label]="isOpen ? 'SHARED.AUTO_STR_34' : 'SHARED.AUTO_STR_42'"
        [attr.aria-expanded]="isOpen"
      >
        @if (isOpen) {
          <lucide-icon name="x" [size]="25" [strokeWidth]="2.2"></lucide-icon>
        } @else {
          <lucide-icon name="message-circle" [size]="27" [strokeWidth]="2.1"></lucide-icon>
        }
        @if (!isOpen && unreadCount > 0) {
          <span>{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
        }
      </button>

      @if (errorMessage) {
        <div class="customer-floating-chat__toast">{{ errorMessage }}</div>
      }
    </div>
  `
})
export class FloatingChatComponent {
  isAdmin = false;
  isOpen = false;
  isSupportActive = true;
  isSearchOpen = false;
  messageSearch = '';
  messageValue = '';
  menuMessageId = '';
  reactionMessageId = '';
  replyMessage: any = null;
  editMessage: any = null;
  deleteMessage: any = null;
  errorMessage = '';
  isRecording = false;
  recordingSeconds = 0;
  unreadCount = 0;

  REACTION_OPTIONS = ['ðŸ‘', 'â¤ï¸', 'ðŸ˜‚', 'ðŸ˜®', 'ðŸ˜¢', 'ðŸ™'];
  messages: any[] = []; // Mock messages

  @ViewChild('messagesRef') messagesRef!: ElementRef<HTMLDivElement>;
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLTextAreaElement>;

  get normalizedMessageSearch() {
    return this.messageSearch.trim().toLowerCase();
  }

  get searchResultCount() {
    return this.messages.filter(m => this.isSearchMatch(m)).length;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) this.messageSearch = '';
  }

  setIsOpen(value: boolean) {
    this.isOpen = value;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  messageKind(message: any): string {
    return message.kind || 'text';
  }

  isSearchMatch(message: any): boolean {
    if (!this.normalizedMessageSearch) return true;
    return (message.text || '').toLowerCase().includes(this.normalizedMessageSearch);
  }

  scrollToMessage(id: string) {
  }

  openImage(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  aggregateReactions(message: any): any[] {
    return message.reactions || [];
  }

  reactToMessage(message: any, emoji: string) {
    this.reactionMessageId = '';
  }

  toggleMenu(id: string) {
    this.menuMessageId = this.menuMessageId === id ? '' : id;
    this.reactionMessageId = '';
  }

  toggleReaction(id: string) {
    this.reactionMessageId = id;
    this.menuMessageId = '';
  }

  chooseReply(message: any) {
    this.replyMessage = message;
    this.menuMessageId = '';
  }

  chooseEdit(message: any) {
    this.editMessage = message;
    this.menuMessageId = '';
  }

  copyMessage(message: any) {
    this.menuMessageId = '';
  }

  prepareDelete(message: any) {
    this.deleteMessage = message;
    this.menuMessageId = '';
  }

  clearComposerMode() {
    this.replyMessage = null;
    this.editMessage = null;
  }

  getPreview(message: any): string {
    return message?.text || '';
  }

  formatRecordingTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
  }

  stopRecording() {
    this.isRecording = false;
  }

  startRecording() {
    this.isRecording = true;
  }

  sendTextMessage(event: Event) {
    event.preventDefault();
  }

  handleImageSelected(event: any) {}

  onTextareaKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
  }

  confirmDelete(mode: string) {
    this.deleteMessage = null;
  }
}
