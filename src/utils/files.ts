export function sanitizePath(filePath: string) {
  return filePath.replaceAll("\\", "-");
}
