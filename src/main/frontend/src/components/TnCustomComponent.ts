export class TnCustomComponent {
  hasProp(property: string): boolean {
    return this[property] || this[property] === "";
  }
}
