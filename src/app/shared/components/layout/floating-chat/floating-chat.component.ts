import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, ElementRef, ViewChild, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ChatService } from '../../../../data/services/chat.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="customer-floating-chat">
      @if (isOpen) {
        <section
          class="customer-floating-chat__panel"
          role="dialog"
          aria-modal="false"
          [attr.aria-label]="'SHARED.AUTO_STR_27' | translate"
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
                  {{ (isSupportActive ? 'SHARED.AUTO_STR_76' : 'SHARED.AUTO_STR_66') | translate }}
                </span>
              </div>
            </div>

            <div class="customer-floating-chat__header-actions">
              <button
                type="button"
                [class.is-active]="isSearchOpen"
                (click)="toggleSearch()"
                [attr.aria-label]="'SHARED.AUTO_STR_37' | translate"
              >
                <lucide-icon name="search" [size]="18" [strokeWidth]="2"></lucide-icon>
              </button>
              <button type="button" (click)="setIsOpen(false)" [attr.aria-label]="'SHARED.AUTO_STR_47' | translate">
                <lucide-icon name="x" [size]="20" [strokeWidth]="2"></lucide-icon>
              </button>
            </div>
          </header>

          @if (isSearchOpen) {
            <label class="customer-floating-chat__message-search">
              <lucide-icon name="search" [size]="16"></lucide-icon>
              <input
                [(ngModel)]="messageSearch"
                [placeholder]="'SHARED.AUTO_STR_31' | translate"
                autofocus
              />
              @if (normalizedMessageSearch) {
                <span>{{ searchResultCount }} {{ 'COMMON.RESULTS' | translate }}</span>
              }
              @if (messageSearch) {
                <button type="button" (click)="messageSearch = ''" [attr.aria-label]="'SHARED.AUTO_STR_73' | translate">
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
                <p>{{ 'SHARED.AUTO_STR_4' | translate }}</p>
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
                      <em class="customer-floating-chat__forwarded">↳ {{ 'SHARED.AUTO_STR_53' | translate }}</em>
                    }

                    @if (message.replyTo) {
                      <button
                        type="button"
                        class="customer-floating-chat__reply-preview"
                        (click)="scrollToMessage(message.replyTo.messageId)"
                      >
                        <strong>{{ (message.replyTo.sender === 'staff' ? 'SHARED.AUTO_STR_72' : 'SHARED.AUTO_STR_111') | translate }}</strong>
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
                            <img [src]="message.mediaUrl" [alt]="message.fileName || ('SHARED.AUTO_STR_70' | translate)" />
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
                        [attr.aria-label]="'SHARED.AUTO_STR_48' | translate"
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
                <strong>{{ (editMessage ? 'SHARED.AUTO_STR_54' : 'SHARED.AUTO_STR_40') | translate }}</strong>
                <span>{{ getPreview(editMessage || replyMessage) | slice:0:90 }}</span>
              </div>
              <button type="button" (click)="clearComposerMode()" [attr.aria-label]="'COMMON.CANCEL' | translate">
                <lucide-icon name="x" [size]="17"></lucide-icon>
              </button>
            </div>
          }

          @if (isRecording) {
            <div class="customer-floating-chat__recording-bar">
              <span><i></i> {{ 'SHARED.AUTO_STR_58' | translate }} {{ formatRecordingTime(recordingSeconds) }}</span>
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
              [attr.aria-label]="'SHARED.AUTO_STR_71' | translate"
              [disabled]="isRecording"
            >
              <lucide-icon name="image" [size]="19"></lucide-icon>
            </button>
            <button
              type="button"
              class="customer-floating-chat__tool"
              [class.is-recording]="isRecording"
              (click)="isRecording ? stopRecording() : startRecording()"
              [attr.aria-label]="(isRecording ? 'SHARED.AUTO_STR_20' : 'SHARED.AUTO_STR_38') | translate"
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
              [placeholder]="(editMessage ? 'SHARED.AUTO_STR_60' : 'SHARED.AUTO_STR_45') | translate"
              [attr.aria-label]="'DASHBOARD.AUTO_STR_348' | translate"
              rows="1"
              [disabled]="isRecording"
              (keydown)="onTextareaKeyDown($event)"
            ></textarea>
            <button
              type="submit"
              class="customer-floating-chat__send"
              [disabled]="!messageValue.trim() || isRecording"
              [attr.aria-label]="(editMessage ? 'SHARED.AUTO_STR_67' : 'SHARED.AUTO_STR_55') | translate"
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
                  [attr.aria-label]="'SHARED.AUTO_STR_33' | translate"
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
        [attr.aria-label]="(isOpen ? 'SHARED.AUTO_STR_34' : 'SHARED.AUTO_STR_42') | translate"
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
export class FloatingChatComponent implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  authService = inject(AuthService);

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

  REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  messages: any[] = [];
  conversationId?: string;
  private messageSub?: Subscription;

  private refreshSub?: Subscription;

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadConversation();
    }
    
    this.refreshSub = this.chatService.refreshConversation$.subscribe(() => {
      if (this.authService.isAuthenticated()) {
        this.loadConversation();
      }
    });
  }

  ngOnDestroy() {
    this.messageSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
    this.chatService.stopConnection();
  }

  loadConversation() {
    this.chatService.getMyConversation().subscribe({
      next: (res) => {
        if (res) {
          this.conversationId = res.id;
          const oldLen = this.messages.length;
          
          this.messages = res.messages.map(m => ({
            id: m.id,
            sender: m.senderRole === 'Staff' ? 'staff' : 'customer',
            text: m.message,
            sentAt: new Date(m.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

          const newLen = this.messages.length;
          if (!this.isOpen && newLen > oldLen && oldLen > 0) {
            this.unreadCount += (newLen - oldLen);
          } else if (!this.isOpen && oldLen === 0 && newLen > 0) {
            // Check if any messages are from staff that are recent, but for now just show unread if there are messages and we just loaded them while closed
             // In a real app we'd track lastReadAt, but for simplicity:
             if (this.messages[newLen - 1].sender === 'staff') {
                this.unreadCount++;
             }
          }

          this.chatService.startConnection(this.conversationId);
          
          if (!this.messageSub) {
            this.messageSub = this.chatService.messageReceived$.subscribe((msg) => {
              this.messages.push({
                id: Date.now().toString(),
                sender: msg.senderRole === 'Staff' ? 'staff' : 'customer',
                text: msg.message,
                sentAt: new Date(msg.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
              if (!this.isOpen) {
                this.unreadCount++;
              }
              setTimeout(() => this.scrollToBottom(), 100);
            });
          }
          
          setTimeout(() => this.scrollToBottom(), 100);
        }
      }
    });
  }

  scrollToBottom() {
    if (this.messagesRef && this.messagesRef.nativeElement) {
      this.messagesRef.nativeElement.scrollTop = this.messagesRef.nativeElement.scrollHeight;
    }
  }

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
    if (this.isOpen) {
      this.unreadCount = 0;
      setTimeout(() => this.scrollToBottom(), 100);
      
      // Attempt to load if not already loaded and authenticated
      if (!this.conversationId && this.authService.isAuthenticated()) {
        this.loadConversation();
      }
    }
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
    if (!this.messageValue.trim() || !this.conversationId) return;
    
    const text = this.messageValue.trim();
    this.messageValue = '';

    this.chatService.sendMessage(this.conversationId, text).subscribe({
      next: () => {
        // Message will come through SignalR, or we can optimistically append
        this.loadConversation(); // Refresh to be safe, though SignalR should handle it
      }
    });
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
