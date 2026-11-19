import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CaseModel, CaseCreateModel } from '../models/case.model';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CaseService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/cases';

    private casesSignal = signal<CaseModel[]>([]);

    cases = this.casesSignal.asReadonly();

    //GetallCases : recuperer tous les dossiers
    loadCases(): void {
        this.http.get<CaseModel[]>(this.apiUrl)
            .subscribe(cases => this.casesSignal.set(cases));
    }

    //CreateCase : créer un nouveau dossier
    createCase(caseModel: CaseCreateModel): Observable<CaseModel> {
        return this.http.post<CaseModel>(this.apiUrl, caseModel).pipe(
            tap(newCase => {
                this.casesSignal.update(cases => [...cases, newCase]);
            })
        );
    }

    //DeleteCase : On ne gère pas la suppression des dossiers, on gère uniquement l'archivage

    //UpdateCase : Mettre à jour un dossier existant
    updateCase(caseId: string, caseCreateModel: CaseCreateModel): Observable<CaseModel> {
        return this.http.put<CaseModel>(`${this.apiUrl}/${caseId}`, caseCreateModel).pipe(
            tap(updatedCase => {
                this.casesSignal.update(cases =>
                    cases.map(c => c.id === updatedCase.id ? updatedCase : c));
            })
        );
    }

    //ArchiveCase : Archiver un dossier existant
    archiveCase(caseId: string): Observable<CaseModel> {
        return this.http.patch<CaseModel>(`${this.apiUrl}/${caseId}/archive`, {}).pipe(
            tap((archivedCase: CaseModel) => {
                // Le signal est mis à jour directement avec l'objet frais du back-end
                this.casesSignal.update(cases =>
                    cases.map(c => c.id === archivedCase.id ? archivedCase : c)
                );
            })
        );
    }


}
