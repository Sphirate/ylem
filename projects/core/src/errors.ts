export class YlemError extends Error {}
export class YelmValidationError extends YlemError {
    public message = "State value validation error"
}
