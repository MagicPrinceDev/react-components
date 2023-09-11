type Status = Record<string, boolean | undefined | null>;

export function renderClassStatus(base: string, status: Status = {}): string {
  const resultClass = [base];

  Object.entries(status).forEach(([name, status]) => {
    if (status) {
      resultClass.push(`${base}--${name}`);
    }
  });

  return resultClass.join(' ');
}
