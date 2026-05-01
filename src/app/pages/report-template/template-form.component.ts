import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportTemplateService } from './report-template.service';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './template-form.component.html'
})
export class TemplateFormComponent implements OnInit {
  templateForm!: FormGroup;
  isEditMode = false;
  templateId!: number;
  previewHtml: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: ReportTemplateService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.templateId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.templateId) {
      this.isEditMode = true;

      this.service.getById(this.templateId).subscribe(data => {
        this.templateForm.patchValue({
          templateName: data.templateName,
          templateHtml: data.templateContent,
          active: data.active
        });
        this.previewHtml = data.templateContent;
        this.setupLiveSync();
      });
    } else {
      this.previewHtml = this.templateForm.get('templateHtml')?.value;
      this.setupLiveSync();
    }
  }

  private setupLiveSync(): void {
    this.templateForm.get('templateHtml')?.valueChanges.subscribe(value => {
      this.previewHtml = value;
    });

    this.templateForm.get('templateName')?.valueChanges.subscribe(name => {
      const currentHtml = this.templateForm.get('templateHtml')?.value;
      if (!currentHtml) return;

      const updatedHtml = currentHtml.replace(
        /<title>.*?<\/title>/i,
        `<title>${name || ''}</title>`
      );

      this.templateForm.patchValue(
        { templateHtml: updatedHtml },
        { emitEvent: false }
      );

      this.previewHtml = updatedHtml;
    });
  }

  initForm(): void {
    this.templateForm = this.fb.group({
      templateName: ['', Validators.required],
      templateHtml: [this.getEmptyHtmlTemplate(), Validators.required],
      active: [true]
    });
  }

  onSubmit(): void {
    if (!this.templateForm.valid) return;

    const payload = {
      id: this.templateId,
      templateName: this.templateForm.value.templateName,
      templateContent: this.templateForm.value.templateHtml,
      active: this.templateForm.value.active
    };

    if (this.isEditMode) {
      this.service.update(this.templateId, payload)
        .subscribe(() => this.router.navigate(['/templates']));
    } else {
      this.service.create(payload)
        .subscribe(() => this.router.navigate(['/templates']));
    }
  }

  private getEmptyHtmlTemplate(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title></title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #1f2937; }
    .section { margin-bottom: 20px; }
  </style>
</head>
<body>

  <h1>Report Title</h1>

</body>
</html>`;
  }
}
