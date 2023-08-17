export function isDev() {
  return process.env.NODE_ENV === 'development';
}

export function formatDate(date: number) {
  return new Date(date).toLocaleDateString();
}
