export function embedInHtml(filePath: string) {
  return `
    <body style="margin: 0px">
    <img src="${filePath}" />
    </body>
    `;
}
