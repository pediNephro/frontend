import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Facture, FactureService } from './facture.service';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './facture.component.html'
})
export class FactureComponent implements OnInit, OnDestroy {
  factures: Facture[] = [];

  pdfModalOpen = false;
  pdfUrl: SafeResourceUrl | null = null;
  rawPdfUrl: string | null = null;
  selectedFactureId: number | null = null;

  constructor(
    private factureService: FactureService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.factureService.getAllFactures().subscribe({
      next: (data) => {
        this.factures = data;
      },
      error: (err) => {
        console.error('Erreur chargement factures :', err);
      }
    });
  }

  viewPdf(id: number | undefined): void {
    if (!id) return;

    this.selectedFactureId = id;

    this.factureService.getFacturePdf(id, false).subscribe({
      next: (blob: Blob) => {
        if (this.rawPdfUrl) {
          URL.revokeObjectURL(this.rawPdfUrl);
        }
        this.rawPdfUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawPdfUrl);
        this.pdfModalOpen = true;
      },
      error: (err) => console.error('Erreur ouverture PDF :', err)
    });
  }

  downloadPdf(id: number | undefined): void {
    if (!id) return;

    this.factureService.getFacturePdf(id, true).subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `facture_${id}.pdf`;
        a.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (err) => console.error('Erreur téléchargement PDF :', err)
    });
  }

  closePdfModal(): void {
    this.pdfModalOpen = false;
    this.pdfUrl = null;
    this.selectedFactureId = null;

    if (this.rawPdfUrl) {
      URL.revokeObjectURL(this.rawPdfUrl);
      this.rawPdfUrl = null;
    }
  }

  delete(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this facture?')) {
      this.factureService.deleteFacture(id).subscribe({
        next: () => this.loadFactures(),
        error: (err) => console.error('Erreur suppression :', err)
      });
    }
  }

  ngOnDestroy(): void {
    if (this.rawPdfUrl) {
      URL.revokeObjectURL(this.rawPdfUrl);
    }
  }
}
