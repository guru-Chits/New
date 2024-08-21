import { FormControl } from "@angular/forms";

export interface IPaymentForm {
    date: FormControl<string | null>;
    serialNumber: FormControl<string | null>;
    receiptNumbber: FormControl<string | null>;
    passbooknumber: FormControl<string | null>;
    groupId: FormControl<string | null>;
    amountPaid: FormControl<string | null>;
    collectionType: FormControl<string | null>;
    subscriberId: FormControl<string | null>;
    subsriberName: FormControl<string | null>;
    installmentNumber: FormControl<string | null>;
    installmentMonth: FormControl<string | null>;
    region: FormControl<string | null>;
    staff: FormControl<string | null>;
    chitAmount: FormControl<string | null>;
}