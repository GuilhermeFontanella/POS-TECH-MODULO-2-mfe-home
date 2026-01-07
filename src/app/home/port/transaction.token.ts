import { InjectionToken } from "@angular/core";
import { TransactionPort } from "./transaction.port";

export const TRANSACTION = new InjectionToken<TransactionPort>('TRANSACTION');