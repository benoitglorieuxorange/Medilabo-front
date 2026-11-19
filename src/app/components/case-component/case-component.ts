import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaseService } from '../../services/case.service';
import { CaseModel, CaseCreateModel } from '../../models/case.model';

@Component({
    standalone: true,
    selector: 'app-case-component',
    imports: [ReactiveFormsModule, DatePipe],
    styleUrl: './case-component.css',
    templateUrl: './case-component.html',
})
export class CaseComponent implements OnInit {
    private caseService = inject(CaseService);

    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    // temporaire
    isAdmin = true;

    caseList = this.caseService.cases;

    // Identifiant du dossier en cours de modification
    editingId = signal<string | null>(null);
    isEditing = computed(() => this.editingId() !== null);

    caseForm = new FormGroup({
        firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        dateNaissance: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        sexe: new FormControl<'M' | 'F' | ''>('', { nonNullable: true, validators: [Validators.required] }),
        phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        adresse: new FormGroup({
            numero: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            line1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            line2: new FormControl('', { nonNullable: true }),
            ville: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            codePostal: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            pays: new FormControl('', { nonNullable: true }),
        }),
        status: new FormControl<'ACTIVE' | 'ARCHIVED'>('ACTIVE', { nonNullable: true }),
    });

    ngOnInit(): void {
        this.caseService.loadCases();
    }

    // Sélection d'un dossier pour modification
    editCase(caseModel: CaseModel): void {
        this.editingId.set(caseModel.id);
        this.caseForm.reset(caseModel);
        this.successMessage.set(null);
        this.errorMessage.set(null);
    }

    submitForm(): void {
        if (this.caseForm.invalid) {
            this.caseForm.markAllAsTouched();
            return;
        }

        const formValue = this.caseForm.getRawValue();
        if (formValue.sexe === '') {
            this.caseForm.controls.sexe.markAsTouched();
            return;
        }
        const caseData: CaseCreateModel = { ...formValue, sexe: formValue.sexe };
        const id = this.editingId();

        const request$: Observable<CaseModel> =
            id !== null
                ? this.caseService.updateCase(id, caseData)
                : this.caseService.createCase(caseData);

        request$.subscribe({
            next: () => {
                this.successMessage.set(id !== null ? 'Dossier modifié.' : 'Dossier créé.');
                this.errorMessage.set(null);
                this.resetForm(); // la liste est déjà à jour grâce au tap() du service
            },
            error: () => {
                this.errorMessage.set("Erreur lors de l'enregistrement du dossier.");
                this.successMessage.set(null);
            },
        });
    }

    archiveCase(caseModel: CaseModel): void {
        this.caseService.archiveCase(caseModel.id).subscribe({
            error: () => this.errorMessage.set("Impossible d'archiver le dossier."),
        });
    }

    resetForm(): void {
        this.caseForm.reset(); // valeurs initiales, dont status = 'ACTIVE'
        this.editingId.set(null);
    }
}