import { FormControl } from "@angular/forms";

export interface IPaymentForm {
    // date: FormControl<string | null>;
    serialNum: FormControl<string | null>;
    receiptNumb: FormControl<string | null>;
    passbookNum: FormControl<string | null>;
    groupId: FormControl<string | null>;
    amountPaid: FormControl<string | null>;
    // collectionType: FormControl<string | null>;
    // subsId: FormControl<string | null>;
    // subsName: FormControl<string | null>;
    // installNum: FormControl<string | null>;
    // installMonth: FormControl<string | null>;
    // areaId: FormControl<string | null>;
    // staff: FormControl<string | null>;
    // chitAmount: FormControl<string | null>;
}