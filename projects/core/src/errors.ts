export class YlemError extends Error {}
// tslint:disable-next-line: max-classes-per-file
export class YelmValidationError extends YlemError {
    public message = "State value validation error";
}
