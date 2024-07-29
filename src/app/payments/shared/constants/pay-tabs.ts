import { ITab } from "../../../shared/interface/tab";

export const payTabCode = {
    payment: 'payment',
    collection: 'collection',
    transaction: 'transaction'
}

export const payTabs : ITab[] = [
    {
      title: 'Payment',
      code: payTabCode.payment,
      class: '',
      action: true,
      actKey: 'viewPayment'
    },
    {
      title: 'Collection',
      code: payTabCode.collection,
      class: '',
      action: false,
      actKey: 'viewCollection'
    },
    {
      title: 'Transaction',
      code: payTabCode.transaction,
      class: '',
      action: false,
      actKey: 'viewTransaction'
    }
]