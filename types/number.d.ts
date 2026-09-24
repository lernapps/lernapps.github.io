// Nur für die Typprüfung (jsconfig.json), nicht im Build: Number.isInteger(x) === true heißt, x ist eine Zahl.
// Die Standard-Lib gibt nur boolean zurück; mit dieser Überladung verengt tsc den Typ wie bei typeof x === "number".
interface NumberConstructor {
  isInteger(number: unknown): number is number;
}
