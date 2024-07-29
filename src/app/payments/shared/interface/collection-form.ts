import { FormControl } from "@angular/forms";

export interface ICollectionForm {
    date: FormControl<string | null>;
    areaId: FormControl<string | null>;
    staff: FormControl<string | null>;
    collectionAmount: FormControl<string | null>;
    amountCollected: FormControl<string | null>;
    balance: FormControl<string | null>;
    serialNo: FormControl<string | null>;
    verfiedBy: FormControl<string | null>;
}