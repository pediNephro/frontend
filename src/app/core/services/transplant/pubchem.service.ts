// pubchem.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap, catchError } from 'rxjs';

export interface DrugInfo {
  cid: number;
  name: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: number;
  xLogP: number | null;
  tpsa: number | null;
  complexity: number | null;
  hBondDonorCount: number | null;
  hBondAcceptorCount: number | null;
  rotatableBondCount: number | null;
  canonicalSmiles: string;
  synonyms: string[];
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class PubchemService {
  private BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  private AUTOCOMPLETE_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete';

  constructor(private http: HttpClient) {}

  /**
   * Search for drugs by name and return suggestions
   */
  searchDrug(query: string): Observable<string[]> {
    if (!query || query.trim().length < 2) return of([]);
    
    return this.http
      .get<any>(`${this.AUTOCOMPLETE_BASE}/compound/${encodeURIComponent(query)}/json?limit=10`)
      .pipe(
        map((res) => res.dictionary_terms?.compound || []),
        catchError(() => of([]))
      );
  }

  /**
   * Get complete drug info using parallel calls (forkJoin)
   */
  getDrugInfo(drugName: string): Observable<DrugInfo> {
    const encoded = encodeURIComponent(drugName);

    return this.http
      .get<any>(`${this.BASE}/compound/name/${encoded}/cids/JSON`)
      .pipe(
        switchMap((cidRes) => {
          const cid = cidRes?.IdentifierList?.CID?.[0];
          if (!cid) throw new Error('Drug not found');

          const props$ = this.http.get<any>(
            `${this.BASE}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,XLogP,TPSA,Complexity,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,CanonicalSMILES/JSON`
          ).pipe(catchError(() => of(null)));

          const synonyms$ = this.http.get<any>(
            `${this.BASE}/compound/cid/${cid}/synonyms/JSON`
          ).pipe(catchError(() => of(null)));

          // Parallel calls with forkJoin
          return forkJoin({
            props: props$,
            synonyms: synonyms$
          }).pipe(
            map(({ props, synonyms }) => {
              const p = props?.PropertyTable?.Properties?.[0];
              const synList: string[] =
                synonyms?.InformationList?.Information?.[0]?.Synonym?.slice(0, 10) || [];

              return {
                cid,
                name: drugName,
                iupacName: p?.IUPACName || 'N/A',
                molecularFormula: p?.MolecularFormula || 'N/A',
                molecularWeight: p?.MolecularWeight || 0,
                xLogP: p?.XLogP ?? null,
                tpsa: p?.TPSA ?? null,
                complexity: p?.Complexity ?? null,
                hBondDonorCount: p?.HBondDonorCount ?? null,
                hBondAcceptorCount: p?.HBondAcceptorCount ?? null,
                rotatableBondCount: p?.RotatableBondCount ?? null,
                canonicalSmiles: p?.CanonicalSMILES || 'N/A',
                synonyms: synList,
                imageUrl: `${this.BASE}/compound/cid/${cid}/PNG`,
              } as DrugInfo;
            })
          );
        }),
        catchError((err) => {
          console.error('PubChem Error:', err);
          throw err;
        })
      );
  }
}