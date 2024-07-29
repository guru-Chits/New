import { FormControl } from "@angular/forms";

export interface ITransactionForm {
    date: FormControl<string | null>;
    areaId: FormControl<string | null>;
    collectionType: FormControl<string | null>;
    collectionCount: FormControl<string | null>;
    collectionAmount: FormControl<string | null>;
    totalSerialNo: FormControl<string | null>;
    grandTotal: FormControl<string | null>;
}