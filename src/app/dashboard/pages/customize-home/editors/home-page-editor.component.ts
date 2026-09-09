import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HomePageConfigService } from '../../../../core/services/page-configs/home-page-config.service';
import { SectionCardComponent } from '../components/section-card/section-card.component';
import { homeCategories, homeProducts } from '../../../../shared/data/homePageData';

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
  editingSection: any = null;

  titles: Record<string, string> = {
    hero: "الصورة الرئيسية (البانر)",
    benefits: "الشريط المميز تحت البانر",
    categories: "الأقسام (تسوق حسب الفئة)",
    bestsellers: "الأكثر مبيعاً",
    promo: "بانر العروض الترويجية",
  };

  heroVisual = '/assets/home/hero-visual-hd.png';
  offerBanner = '/assets/home/offer-products-banner-hd.png';

  get sections() {
    return this.config().sections || [];
  }

  trackBySectionId(index: number, section: any): string {
    return section?.id || `sec-${index}`;
  }

  trackBySlideId(index: number, slide: any): string {
    return slide?.id || `slide-${index}`;
  }

  trackByBenefitId(index: number, benefit: any): string {
    return benefit?.id || `benefit-${index}`;
  }

  trackByItemId(index: number, item: any): string {
    return item?.id || `item-${index}`;
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
    if (this.editingSection && this.editingSection.id === id) {
      this.editingSection = { ...this.editingSection, ...updates };
    }
  }

  duplicateSection(index: number) {
    const original = this.sections[index];
    const newSection = {
      ...JSON.parse(JSON.stringify(original)),
      id: "sec-" + original.type + "-" + Date.now().toString(36)
    };
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
    const timestamp = Date.now().toString(36);
    const newSection: any = {
      id: `sec-${type}-${timestamp}`,
      type,
      enabled: true
    };

    if (type === 'hero') {
      newSection.title = "الصورة الرئيسية (البانر)";
      newSection.slides = [
        { id: `slide-${timestamp}`, image: this.heroVisual, title: "شد أقوى\nوقوام أفضل" }
      ];
    } else if (type === 'benefits') {
      newSection.benefits = [
        { id: `b1-${timestamp}`, text: 'توصيل سريع ومجاني', icon: "Truck", enabled: true },
        { id: `b2-${timestamp}`, text: 'دفع آمن عند الاستلام', icon: "CreditCard", enabled: true }
      ];
    } else if (type === 'categories') {
      newSection.title = 'تسوق حسب الفئة';
      newSection.showTitle = true;
      newSection.categories = homeCategories.map(c => ({
        id: c.id,
        name: c.label,
        image: c.image
      }));
    } else if (type === 'bestsellers') {
      newSection.title = 'الأكثر مبيعاً';
      newSection.showTitle = true;
      newSection.products = homeProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.oldPrice,
        image: p.image,
        discount: p.discount ? `-${p.discount}%` : undefined,
        rating: p.rating,
        reviewsCount: p.reviews
      }));
    } else if (type === 'promo') {
      newSection.image = this.offerBanner;
    }

    this.updateConfig({ sections: [...this.sections, newSection] });
    this.showAddMenu = false;
  }

  addHeroSlide(section: any) {
    const slides = section.slides || (section.image ? [{ id: 'old-1', image: section.image }] : []);
    const newSlide = { id: 'slide-' + Date.now().toString(36), image: this.heroVisual, title: 'عنوان الشريحة' };
    this.updateSection(section.id, { slides: [...slides, newSlide] });
  }

  duplicateSlide(section: any, slideIndex: number) {
    const slides = [...(section.slides || [])];
    const newSlide = { ...slides[slideIndex], id: 'slide-' + Date.now().toString(36) };
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
    benefits.push({ id: "b-" + Date.now().toString(36), text: 'شحن مجاني\nلجميع الطلبات', icon: "Truck", enabled: true });
    this.updateSection(section.id, { benefits });
  }

  openContentEditor(section: any) {
    this.editingSection = section;
  }

  closeContentEditor() {
    this.editingSection = null;
  }

  removeItemFromActiveSection(idx: number) {
    if (!this.editingSection) return;
    if (this.editingSection.type === 'categories') {
      const cats = [...(this.editingSection.categories || [])];
      cats.splice(idx, 1);
      this.updateSection(this.editingSection.id, { categories: cats });
    } else if (this.editingSection.type === 'bestsellers') {
      const prods = [...(this.editingSection.products || [])];
      prods.splice(idx, 1);
      this.updateSection(this.editingSection.id, { products: prods });
    }
  }

  addItemToActiveSection() {
    if (!this.editingSection) return;
    if (this.editingSection.type === 'categories') {
      const cats = [...(this.editingSection.categories || [])];
      const sample = homeCategories[cats.length % homeCategories.length];
      cats.push({
        id: `cat-${Date.now().toString(36)}`,
        name: sample.label,
        image: sample.image
      });
      this.updateSection(this.editingSection.id, { categories: cats });
    } else if (this.editingSection.type === 'bestsellers') {
      const prods = [...(this.editingSection.products || [])];
      const sample = homeProducts[prods.length % homeProducts.length];
      prods.push({
        id: `prod-${Date.now().toString(36)}`,
        name: sample.name,
        price: sample.price,
        originalPrice: sample.oldPrice,
        image: sample.image,
        rating: sample.rating,
        reviewsCount: sample.reviews
      });
      this.updateSection(this.editingSection.id, { products: prods });
    }
  }
}
