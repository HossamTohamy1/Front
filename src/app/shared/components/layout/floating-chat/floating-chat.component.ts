import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, ElementRef, ViewChild, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ChatService } from '../../../../data/services/chat.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { getOrCreateUserTag } from '../../../../core/utils/user-tag.util';

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
          aria-label="محادثة الدعم الفني"
        >
          <!-- Header -->
          <header class="customer-floating-chat__header">
            <div class="customer-floating-chat__support">
              <div class="customer-floating-chat__avatar" aria-hidden="true">
                <lucide-icon name="headphones" [size]="20" [strokeWidth]="2"></lucide-icon>
              </div>
              <div class="customer-floating-chat__info">
                <strong class="customer-floating-chat__title">LOXX KING — الدعم الفني</strong>
                <span class="customer-floating-chat__status is-active">
                  <i class="customer-floating-chat__status-dot" aria-hidden="true"></i>
                  متصل الآن للمساعدة
                </span>
              </div>
            </div>

            <div class="customer-floating-chat__header-actions">
              <button
                type="button"
                class="customer-floating-chat__header-btn"
                [class.is-active]="isSearchOpen"
                (click)="toggleSearch()"
                title="بحث داخل المحادثة"
                aria-label="بحث داخل المحادثة"
              >
                <lucide-icon name="search" [size]="18" [strokeWidth]="2"></lucide-icon>
              </button>
              <button
                type="button"
                class="customer-floating-chat__header-btn"
                (click)="setIsOpen(false)"
                title="إغلاق المحادثة"
                aria-label="إغلاق المحادثة"
              >
                <lucide-icon name="x" [size]="20" [strokeWidth]="2"></lucide-icon>
              </button>
            </div>
          </header>

          <!-- Search Bar -->
          @if (isSearchOpen) {
            <label class="customer-floating-chat__search-bar">
              <lucide-icon name="search" [size]="16" [strokeWidth]="2"></lucide-icon>
              <input
                [(ngModel)]="messageSearch"
                placeholder="ابحث داخل الرسائل..."
                autofocus
              />
              @if (normalizedMessageSearch) {
                <span class="customer-floating-chat__search-count">{{ searchResultCount }} نتيجة</span>
              }
              @if (messageSearch) {
                <button
                  type="button"
                  class="customer-floating-chat__search-clear"
                  (click)="messageSearch = ''"
                  aria-label="مسح البحث"
                >
                  <lucide-icon name="x" [size]="14"></lucide-icon>
                </button>
              }
            </label>
          }

          <!-- Messages Scroll Area -->
          <div #messagesRef class="customer-floating-chat__messages">
            <span class="customer-floating-chat__day">اليوم</span>

            @if (messages.length === 0) {
              <div class="customer-floating-chat__welcome">
                <div class="customer-floating-chat__welcome-icon">
                  <lucide-icon name="message-circle" [size]="28" [strokeWidth]="2"></lucide-icon>
                </div>
                <strong>مرحبًا بك في خدمة عملاء LOXX KING</strong>
                <p>اكتب رسالتك وسيقوم أحد ممثلي الدعم الفني بالرد عليك ومساعدتك على الفور.</p>
              </div>
            } @else {
              @for (message of messages; track message.id) {
                <div
                  class="customer-floating-chat__row"
                  [ngClass]="{
                    'customer-floating-chat__row--customer': message.sender === 'customer',
                    'customer-floating-chat__row--staff': message.sender === 'staff',
                    'is-search-dim': normalizedMessageSearch && !isSearchMatch(message),
                    'is-search-match': normalizedMessageSearch && isSearchMatch(message)
                  }"
                  [attr.data-search-match]="normalizedMessageSearch && isSearchMatch(message) ? 'true' : 'false'"
                >
                  <div class="customer-floating-chat__msg-group">
                    <!-- Sender Name Tag -->
                    <div class="customer-floating-chat__sender-tag" [ngClass]="'is-' + message.sender">
                      @if (message.sender === 'staff') {
                        <span class="customer-floating-chat__sender-badge">🎧</span>
                        <span class="customer-floating-chat__sender-name">{{ message.senderName || 'أستاذ سعيد (الدعم الفني)' }}</span>
                      } @else {
                        <span class="customer-floating-chat__sender-badge">👤</span>
                        <span class="customer-floating-chat__sender-name">{{ message.senderName || userTag }}</span>
                      }
                    </div>

                    @if (message.forwarded) {
                      <em class="customer-floating-chat__forwarded">↳ مُعاد توجيهها</em>
                    }

                    @if (message.replyTo) {
                      <button
                        type="button"
                        class="customer-floating-chat__reply-preview"
                        (click)="scrollToMessage(message.replyTo.messageId)"
                      >
                        <strong>{{ message.replyTo.sender === 'staff' ? 'الدعم الفني' : 'أنت' }}</strong>
                        <span>{{ message.replyTo.preview }}</span>
                      </button>
                    }

                    <!-- Bubble + Actions Row -->
                    <div class="customer-floating-chat__bubble-container">
                      <!-- Customer Actions (left side of customer bubble) -->
                      @if (message.sender === 'customer' && !message.deletedForEveryone) {
                        <div class="customer-floating-chat__actions">
                          <button
                            type="button"
                            class="customer-floating-chat__more-btn"
                            (click)="$event.stopPropagation(); toggleMenu(message.id)"
                            title="خيارات الرسالة"
                            aria-label="خيارات الرسالة"
                          >
                            <lucide-icon name="more-horizontal" [size]="15"></lucide-icon>
                          </button>
                          @if (menuMessageId === message.id) {
                            <div class="customer-floating-chat__menu is-customer">
                              <button type="button" (click)="chooseReply(message)">
                                <lucide-icon name="reply" [size]="13"></lucide-icon>رد
                              </button>
                              <button type="button" (click)="toggleReaction(message.id)">
                                <lucide-icon name="smile" [size]="13"></lucide-icon>تفاعل
                              </button>
                              <button type="button" (click)="copyMessage(message)">
                                <lucide-icon name="copy" [size]="13"></lucide-icon>نسخ
                              </button>
                              @if (messageKind(message) === 'text') {
                                <button type="button" (click)="chooseEdit(message)">
                                  <lucide-icon name="edit-3" [size]="13"></lucide-icon>تعديل
                                </button>
                              }
                              <button type="button" class="is-danger" (click)="prepareDelete(message)">
                                <lucide-icon name="trash-2" [size]="13"></lucide-icon>حذف
                              </button>
                            </div>
                          }
                          @if (reactionMessageId === message.id) {
                            <div class="customer-floating-chat__reactions-popup is-customer">
                              @for (emoji of REACTION_OPTIONS; track emoji) {
                                <button type="button" (click)="reactToMessage(message, emoji)">{{ emoji }}</button>
                              }
                            </div>
                          }
                        </div>
                      }

                      <!-- The Message Bubble -->
                      <div class="customer-floating-chat__bubble" [ngClass]="'is-' + message.sender" [attr.data-message-id]="message.id">
                        @if (message.deletedForEveryone) {
                          <p class="customer-floating-chat__deleted">تم حذف هذه الرسالة</p>
                        } @else {
                          @if (messageKind(message) === 'image' && message.mediaUrl) {
                            <div
                              class="customer-floating-chat__media-image"
                              (click)="openImage(message.mediaUrl)"
                              title="عرض الصورة بالحجم الكامل"
                            >
                              <img [src]="message.mediaUrl" [alt]="message.fileName || 'صورة مرفقة'" />
                            </div>
                          }
                          @if (messageKind(message) === 'audio' && message.mediaUrl) {
                            <audio class="customer-floating-chat__media-audio" controls preload="metadata" [src]="message.mediaUrl"></audio>
                          }
                          @if (message.text) {
                            <p class="customer-floating-chat__text">{{ message.text }}</p>
                          }
                        }
                      </div>

                      <!-- Staff Actions (left side of staff bubble) -->
                      @if (message.sender === 'staff' && !message.deletedForEveryone) {
                        <div class="customer-floating-chat__actions">
                          <button
                            type="button"
                            class="customer-floating-chat__more-btn"
                            (click)="$event.stopPropagation(); toggleMenu(message.id)"
                            title="خيارات الرسالة"
                            aria-label="خيارات الرسالة"
                          >
                            <lucide-icon name="more-horizontal" [size]="15"></lucide-icon>
                          </button>
                          @if (menuMessageId === message.id) {
                            <div class="customer-floating-chat__menu is-staff">
                              <button type="button" (click)="chooseReply(message)">
                                <lucide-icon name="reply" [size]="13"></lucide-icon>رد
                              </button>
                              <button type="button" (click)="toggleReaction(message.id)">
                                <lucide-icon name="smile" [size]="13"></lucide-icon>تفاعل
                              </button>
                              <button type="button" (click)="copyMessage(message)">
                                <lucide-icon name="copy" [size]="13"></lucide-icon>نسخ
                              </button>
                              <button type="button" class="is-danger" (click)="prepareDelete(message)">
                                <lucide-icon name="trash-2" [size]="13"></lucide-icon>حذف
                              </button>
                            </div>
                          }
                          @if (reactionMessageId === message.id) {
                            <div class="customer-floating-chat__reactions-popup is-staff">
                              @for (emoji of REACTION_OPTIONS; track emoji) {
                                <button type="button" (click)="reactToMessage(message, emoji)">{{ emoji }}</button>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>

                    <!-- Meta: Sent time + Read status -->
                    <div class="customer-floating-chat__meta" [ngClass]="'is-' + message.sender">
                      @if (message.editedAt) {
                        <i class="customer-floating-chat__edited">معدلة</i>
                      }
                      <span class="customer-floating-chat__time">{{ message.sentAt }}</span>
                      @if (message.sender === 'customer') {
                        <lucide-icon name="check-check" [size]="13" [strokeWidth]="2" class="customer-floating-chat__check"></lucide-icon>
                      }
                    </div>

                    <!-- Reactions List -->
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
                </div>
              }
            }
          </div>

          <!-- Composer Context (Reply / Edit Mode) -->
          @if (replyMessage || editMessage) {
            <div class="customer-floating-chat__composer-context">
              <div class="customer-floating-chat__context-details">
                <strong>{{ editMessage ? 'تعديل الرسالة' : 'الرد على الرسالة' }}</strong>
                <span>{{ getPreview(editMessage || replyMessage) | slice:0:90 }}</span>
              </div>
              <button type="button" class="customer-floating-chat__context-close" (click)="clearComposerMode()" title="إلغاء">
                <lucide-icon name="x" [size]="16"></lucide-icon>
              </button>
            </div>
          }

          <!-- Voice Recording Bar -->
          @if (isRecording) {
            <div class="customer-floating-chat__recording-bar">
              <span class="customer-floating-chat__rec-indicator">
                <i class="customer-floating-chat__rec-dot"></i>
                جاري التسجيل {{ formatRecordingTime(recordingSeconds) }}
              </span>
              <button type="button" class="customer-floating-chat__rec-stop-btn" (click)="stopRecording()">إيقاف وإرسال</button>
            </div>
          }

          <!-- Bottom Composer Form -->
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
              class="customer-floating-chat__tool-btn"
              (click)="imageInput.click()"
              title="إرفاق صورة"
              aria-label="إرفاق صورة"
              [disabled]="isRecording"
            >
              <lucide-icon name="image" [size]="19" [strokeWidth]="1.8"></lucide-icon>
            </button>
            <button
              type="button"
              class="customer-floating-chat__tool-btn"
              [class.is-recording]="isRecording"
              (click)="isRecording ? stopRecording() : startRecording()"
              [title]="isRecording ? 'إيقاف التسجيل' : 'تسجيل رسالة صوتية'"
              [attr.aria-label]="isRecording ? 'إيقاف التسجيل' : 'تسجيل رسالة صوتية'"
            >
              @if (isRecording) {
                <lucide-icon name="square" [size]="17" fill="currentColor"></lucide-icon>
              } @else {
                <lucide-icon name="mic" [size]="19" [strokeWidth]="1.8"></lucide-icon>
              }
            </button>
            <div class="customer-floating-chat__input-wrapper">
              <textarea
                #inputRef
                [(ngModel)]="messageValue"
                name="messageValue"
                [placeholder]="editMessage ? 'عدلي الرسالة...' : 'اكتب رسالتك هنا...'"
                rows="1"
                [disabled]="isRecording"
                (keydown)="onTextareaKeyDown($event)"
                aria-label="اكتب رسالتك هنا"
              ></textarea>
            </div>
            <button
              type="submit"
              class="customer-floating-chat__send-btn"
              [disabled]="!messageValue.trim() || isRecording"
              [title]="editMessage ? 'حفظ التعديل' : 'إرسال الرسالة'"
              [attr.aria-label]="editMessage ? 'حفظ التعديل' : 'إرسال الرسالة'"
            >
              @if (editMessage) {
                <lucide-icon name="check-check" [size]="18"></lucide-icon>
              } @else {
                <lucide-icon name="send" [size]="18" [strokeWidth]="2.2"></lucide-icon>
              }
            </button>
          </form>

          <!-- Delete Confirmation Dialog -->
          @if (deleteMessage) {
            <div class="customer-floating-chat__modal-backdrop" role="presentation">
              <section class="customer-floating-chat__delete-modal" role="dialog" aria-modal="true">
                <button
                  type="button"
                  class="customer-floating-chat__modal-close"
                  (click)="deleteMessage = null"
                  title="إلغاء"
                >
                  <lucide-icon name="x" [size]="18"></lucide-icon>
                </button>
                <strong>حذف الرسالة؟</strong>
                <p>هل ترغب في حذف الرسالة لديك فقط أم لدى الجميع؟</p>
                <div class="customer-floating-chat__delete-actions">
                  <button type="button" class="is-danger" (click)="confirmDelete('me')">الحذف لدي</button>
                  <button type="button" class="is-danger-full" (click)="confirmDelete('everyone')">الحذف لدى الجميع</button>
                  <button type="button" class="is-cancel" (click)="deleteMessage = null">إلغاء</button>
                </div>
              </section>
            </div>
          }
        </section>
      }

      <!-- Floating Trigger Button -->
      <button
        type="button"
        class="customer-floating-chat__trigger"
        [class.is-open]="isOpen"
        (click)="toggleChat()"
        [attr.aria-label]="isOpen ? 'إغلاق خدمة العملاء' : 'فتح خدمة العملاء'"
        [attr.aria-expanded]="isOpen"
      >
        @if (isOpen) {
          <lucide-icon name="x" [size]="24" [strokeWidth]="2.2"></lucide-icon>
        } @else {
          <lucide-icon name="message-circle" [size]="26" [strokeWidth]="2"></lucide-icon>
        }
        @if (!isOpen && unreadCount > 0) {
          <span class="customer-floating-chat__badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
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
  userTag = getOrCreateUserTag();
  mediaRecorder: any = null;
  audioChunks: Blob[] = [];
  recordingTimer: any = null;
  mediaStream: MediaStream | null = null;

  REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  messages: any[] = [];
  conversationId?: string;
  private messageSub?: Subscription;
  private refreshSub?: Subscription;

  ngOnInit() {
    this.loadConversation();
    
    this.refreshSub = this.chatService.refreshConversation$.subscribe(() => {
      this.loadConversation();
      if (!this.isOpen) {
        this.unreadCount = Math.max(1, this.unreadCount);
      }
    });
  }

  ngOnDestroy() {
    this.messageSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
    this.chatService.stopConnection();
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
    }
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
    }
  }

  loadConversation() {
    this.chatService.getMyConversation().subscribe({
      next: (res) => {
        if (res && res.id) {
          this.conversationId = res.id;
          
          this.messages = (res.messages || []).map((m: any) => {
            const isStaff = (m.senderType || m.senderRole) === 'Staff' 
              || m.guestName === 'Support'
              || (m.message && (m.message.includes('أستاذ سعيد') || m.message.includes('LOXXKING') || m.message.includes('الدعم للمساعدة')))
              || (m.text && (m.text.includes('أستاذ سعيد') || m.text.includes('LOXXKING') || m.text.includes('الدعم للمساعدة')));
            const att = m.attachmentUrl;
            const isAudio = att && (/\.(webm|mp3|wav|ogg|m4a)$/i.test(att) || att.includes('/audio'));
            const isImage = att && (/\.(png|jpg|jpeg|webp|gif)$/i.test(att) || att.includes('/images') || att.startsWith('data:image'));
            return {
              id: m.id,
              sender: isStaff ? 'staff' : 'customer',
              senderName: isStaff ? 'أستاذ سعيد (الدعم الفني)' : ((m.senderName && m.senderName.toLowerCase().startsWith('user')) ? m.senderName : this.userTag),
              senderType: isStaff ? 'Staff' : 'Customer',
              isRead: m.isRead,
              text: (isAudio || isImage) && (!m.message || m.message === 'تسجيل صوتي' || m.message === 'صورة مرفقة' || m.message === 'Attachment') ? '' : m.message,
              kind: isAudio ? 'audio' : (isImage ? 'image' : 'text'),
              mediaUrl: att,
              sentAt: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
            };
          });

          if (this.isOpen) {
            this.unreadCount = 0;
            this.chatService.markRead(this.conversationId).subscribe();
          } else {
            const unread = this.messages.filter(m => m.sender === 'staff' && !m.isRead);
            this.unreadCount = Math.max(unread.length, this.unreadCount);
          }

          this.chatService.startConnection(this.conversationId);
          
          if (!this.messageSub) {
            this.messageSub = this.chatService.messageReceived$.subscribe((msg) => {
              const isStaff = (msg.senderType || msg.senderRole) === 'Staff' 
                || msg.guestName === 'Support'
                || (msg.message && (msg.message.includes('أستاذ سعيد') || msg.message.includes('LOXXKING') || msg.message.includes('الدعم للمساعدة')));
              const targetSender = isStaff ? 'staff' : 'customer';
              const isDuplicate = (msg.id && this.messages.some(m => m.id === msg.id)) ||
                (this.messages.length > 0 && this.messages[this.messages.length - 1].text === msg.message && this.messages[this.messages.length - 1].sender === targetSender);
              if (isDuplicate) return;

              const att = msg.attachmentUrl;
              const isAudio = att && (/\.(webm|mp3|wav|ogg|m4a)$/i.test(att) || att.includes('/audio'));
              const isImage = att && (/\.(png|jpg|jpeg|webp|gif)$/i.test(att) || att.includes('/images') || att.startsWith('data:image'));

              this.messages.push({
                id: msg.id || Date.now().toString(),
                sender: targetSender,
                senderName: isStaff ? 'أستاذ سعيد (الدعم الفني)' : ((msg.senderName && msg.senderName.toLowerCase().startsWith('user')) ? msg.senderName : this.userTag),
                senderType: isStaff ? 'Staff' : 'Customer',
                isRead: this.isOpen,
                text: (isAudio || isImage) && (!msg.message || msg.message === 'تسجيل صوتي' || msg.message === 'صورة مرفقة' || msg.message === 'Attachment') ? '' : msg.message,
                kind: isAudio ? 'audio' : (isImage ? 'image' : 'text'),
                mediaUrl: att,
                sentAt: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });

              if (!this.isOpen) {
                if (isStaff) {
                  this.unreadCount++;
                }
              } else {
                if (isStaff && this.conversationId) {
                  this.chatService.markRead(this.conversationId).subscribe();
                }
              }
              setTimeout(() => this.scrollToBottom(), 100);
            });
          }
          
          setTimeout(() => this.scrollToBottom(), 100);
        }
      },
      error: () => {
        // Handle gracefully without crashing
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
    if (value) {
      this.unreadCount = 0;
      if (this.conversationId) {
        this.chatService.markRead(this.conversationId).subscribe();
      }
      setTimeout(() => this.scrollToBottom(), 100);
      if (!this.conversationId) {
        this.loadConversation();
      }
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      if (this.conversationId) {
        this.chatService.markRead(this.conversationId).subscribe();
      }
      setTimeout(() => this.scrollToBottom(), 100);
      
      if (!this.conversationId) {
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
    const el = document.querySelector(`[data-message-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.customer-floating-chat__actions')) {
      this.menuMessageId = '';
      this.reactionMessageId = '';
    }
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
    this.inputRef?.nativeElement.focus();
  }

  chooseEdit(message: any) {
    this.editMessage = message;
    this.messageValue = message.text || '';
    this.menuMessageId = '';
    this.inputRef?.nativeElement.focus();
  }

  async copyMessage(message: any) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(message.text || '');
      }
      this.menuMessageId = '';
    } catch {
      this.menuMessageId = '';
    }
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

  async startRecording() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      this.errorMessage = 'التسجيل الصوتي غير مدعوم في هذا المتصفح';
      setTimeout(() => this.errorMessage = '', 4000);
      return;
    }
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      const options = typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? { mimeType: 'audio/webm;codecs=opus' }
        : undefined;

      this.mediaRecorder = options ? new MediaRecorder(this.mediaStream, options) : new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const mime = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mime });
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach(track => track.stop());
          this.mediaStream = null;
        }
        if (this.recordingSeconds >= 1) {
          this.sendAudioMessage(audioBlob);
        }
        this.recordingSeconds = 0;
        clearInterval(this.recordingTimer);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordingSeconds = 0;
      this.recordingTimer = setInterval(() => {
        this.recordingSeconds++;
      }, 1000);
    } catch (err) {
      console.error('Mic access error:', err);
      this.errorMessage = 'يرجى السماح بالوصول إلى الميكروفون لتسجيل الصوت.';
      setTimeout(() => this.errorMessage = '', 4000);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    clearInterval(this.recordingTimer);
  }

  sendAudioMessage(blob: Blob) {
    const fileName = `voice_${Date.now()}.webm`;
    this.chatService.uploadMedia(blob, fileName).subscribe({
      next: (url) => {
        if (url) {
          this.chatService.sendMessage(this.conversationId || '', 'تسجيل صوتي', url, this.userTag).subscribe({
            next: (res: any) => {
              const data = res?.data ?? res;
              if (data?.conversationId) this.conversationId = data.conversationId;
              this.loadConversation();
            }
          });
        }
      },
      error: () => {
        const localUrl = URL.createObjectURL(blob);
        this.messages.push({
          id: 'temp-audio-' + Date.now(),
          sender: 'customer',
          senderName: this.userTag,
          kind: 'audio',
          mediaUrl: localUrl,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  sendTextMessage(event: Event) {
    event.preventDefault();
    if (!this.messageValue.trim()) return;
    
    const text = this.messageValue.trim();
    this.messageValue = '';

    this.chatService.sendMessage(this.conversationId || '', text, undefined, this.userTag).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (data?.conversationId) {
          this.conversationId = data.conversationId;
        }
        this.loadConversation();
      }
    });
  }

  handleImageSelected(event: any) {
    const file: File = event.target?.files?.[0];
    if (!file) return;
    event.target.value = '';

    this.chatService.uploadMedia(file, file.name).subscribe({
      next: (url) => {
        if (url) {
          this.chatService.sendMessage(this.conversationId || '', 'صورة مرفقة', url, this.userTag).subscribe({
            next: (res: any) => {
              const data = res?.data ?? res;
              if (data?.conversationId) this.conversationId = data.conversationId;
              this.loadConversation();
            }
          });
        }
      },
      error: () => {
        const reader = new FileReader();
        reader.onload = () => {
          this.messages.push({
            id: 'temp-img-' + Date.now(),
            sender: 'customer',
            senderName: this.userTag,
            kind: 'image',
            mediaUrl: reader.result as string,
            sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          setTimeout(() => this.scrollToBottom(), 100);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  onTextareaKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendTextMessage(event);
    }
  }

  confirmDelete(mode: string) {
    this.deleteMessage = null;
  }
}
