type Status = Record<string, string | boolean | undefined | null>;

export function renderClassStatus(base: string, status: Status = {}): string {
  const resultClass = [base];

  Object.entries(status).forEach(([name, value]) => {
    if (value) {
      typeof value === 'string'
        ? resultClass.push(`${base}--${value}`)
        : resultClass.push(`${base}--${name}`);
    }
  });

  return resultClass.join(' ');
}
