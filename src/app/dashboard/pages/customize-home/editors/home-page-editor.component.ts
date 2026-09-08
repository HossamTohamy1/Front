import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HomePageConfigService } from '../../../../core/services/page-configs/home-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';

type SectionType = 'hero' | 'benefits' | 'categories' | 'bestsellers' | 'promo';

@Component({
  selector: 'app-home-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent],
  templateUrl: './home-page-editor.component.html'
})
export class HomePageEditorComponent {
  private configService = inject(HomePageConfigService);
  config = this.configService.pageConfig;
  
  draggedIdx: number | null = null;
  showAddMenu = false;

  titles: Record<string, string> = {
    hero: "الصورة الرئيسية (البانر)",
    benefits: "الشريط المميز تحت البانر",
    categories: "الأقسام (تسوق حسب الفئة)",
    bestsellers: "الأكثر مبيعاً",
    promo: "بانر العروض الترويجية",
  };

  heroVisual = 'assets/home/hero-visual-hd.png'; // Fallback
  offerBanner = 'assets/home/offer-products-banner-hd.png'; // Fallback

  get sections() {
    return this.config().sections || [];
  }

  updateConfig(updates: Partial<any>) {
    this.configService.updateConfig({ ...this.config(), ...updates });
  }

  handleDragStart(e: DragEvent, index: number) {
    this.draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index.toString());
    }
  }

  handleDragEnd() {
    this.draggedIdx = null;
  }

  handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  handleDrop(e: DragEvent, dropIdx: number) {
    e.preventDefault();
    if (this.draggedIdx === null || this.draggedIdx === dropIdx) return;
    const newSections = [...this.sections];
    const draggedSection = newSections[this.draggedIdx];
    newSections.splice(this.draggedIdx, 1);
    newSections.splice(dropIdx, 0, draggedSection);
    this.updateConfig({ sections: newSections });
    this.draggedIdx = null;
  }

  updateSection(id: string, updates: Partial<any>) {
    const newSections = this.sections.map((s: any) => s.id === id ? { ...s, ...updates } : s);
    this.updateConfig({ sections: newSections });
  }

  duplicateSection(index: number) {
    const newSection = { ...this.sections[index], id: "sec-" + Date.now() };
    const newSections = [...this.sections];
    newSections.splice(index + 1, 0, newSection);
    this.updateConfig({ sections: newSections });
  }

  deleteSection(index: number) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا القسم؟')) {
      const newSections = [...this.sections];
      newSections.splice(index, 1);
      this.updateConfig({ sections: newSections });
    }
  }

  moveUp(index: number) {
    if (index === 0) return;
    const newSections = [...this.sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    this.updateConfig({ sections: newSections });
  }

  moveDown(index: number) {
    if (index === this.sections.length - 1) return;
    const newSections = [...this.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    this.updateConfig({ sections: newSections });
  }

  addSection(type: SectionType) {
    const newSection: any = {
      id: "sec-" + Date.now(),
      type,
      enabled: true
    };
    if (type === 'hero') {
      newSection.title = "الصورة الرئيسية (البانر)";
      newSection.slides = [{ id: "slide-" + Date.now(), image: this.heroVisual, title: "شد أقوى\nوقوام أفضل" }];
    } else if (type === 'benefits') {
      newSection.benefits = [{ id: "b1-" + Date.now(), text: 'توصيل سريع ومجاني', icon: "Truck", enabled: true }];
    } else if (type === 'categories') {
      newSection.title = 'تسوق حسب الفئة';
      newSection.categories = []; // Simplified
    } else if (type === 'bestsellers') {
      newSection.title = 'الأكثر مبيعاً';
      newSection.products = []; // Simplified
    } else if (type === 'promo') {
      newSection.image = this.offerBanner;
    }

    this.updateConfig({ sections: [...this.sections, newSection] });
    this.showAddMenu = false;
  }

  addHeroSlide(section: any) {
    const slides = section.slides || (section.image ? [{ id: 'old-1', image: section.image }] : []);
    const newSlide = { id: 'slide-' + Date.now(), image: this.heroVisual };
    this.updateSection(section.id, { slides: [...slides, newSlide] });
  }

  duplicateSlide(section: any, slideIndex: number) {
    const slides = [...(section.slides || [])];
    const newSlide = { ...slides[slideIndex], id: 'slide-' + Date.now() };
    slides.splice(slideIndex + 1, 0, newSlide);
    this.updateSection(section.id, { slides });
  }

  updateSlide(section: any, slideIndex: number, updates: Partial<any>) {
    const slides = [...(section.slides || [])];
    slides[slideIndex] = { ...slides[slideIndex], ...updates };
    this.updateSection(section.id, { slides });
  }

  deleteSlide(section: any, slideIndex: number) {
    const slides = [...(section.slides || [])];
    slides.splice(slideIndex, 1);
    this.updateSection(section.id, { slides });
  }

  promptImageChange(section: any, sIdx: number, currentImage: string) {
    const url = window.prompt("أدخل رابط الصورة الجديدة:", currentImage);
    if (url) {
      this.updateSlide(section, sIdx, { image: url });
    }
  }

  promptSectionImageChange(section: any) {
    const url = window.prompt("أدخل رابط الصورة الجديدة:", section.image || '');
    if (url) {
      this.updateSection(section.id, { image: url });
    }
  }

  updateBenefit(section: any, bIdx: number, updates: any) {
    const newBenefits = [...(section.benefits || [])];
    newBenefits[bIdx] = { ...newBenefits[bIdx], ...updates };
    this.updateSection(section.id, { benefits: newBenefits });
  }

  updateBenefitText(section: any, bIdx: number, text: string) {
    const val = text.includes(' - ') ? text.replace(' - ', '\n') : text;
    this.updateBenefit(section, bIdx, { text: val });
  }

  removeBenefit(section: any, bIdx: number) {
    const newB = [...(section.benefits || [])];
    newB.splice(bIdx, 1);
    this.updateSection(section.id, { benefits: newB });
  }

  addBenefit(section: any) {
    const benefits = [...(section.benefits || [])];
    benefits.push({ id: "b-" + Date.now(), text: 'شحن مجاني\nلجميع الطلبات', icon: "Truck", enabled: true });
    this.updateSection(section.id, { benefits });
  }
}
