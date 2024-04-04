export function createFooterTemplate(filePath: string): string {
  return `
    <div
        style="
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0px 20px;
        "
    >
      <p
        style="
          font-size: 8px;
          width: 100%;
          word-break: break-all;
          white-space: normal;
        "
      >
        ${filePath}
      </p>
      <div
        style="
          display: flex;
          align-items: end;
          margin-top: auto;
          margin-bottom: auto;
        "
      >
        <p style="font-size: 8px" class="pageNumber"></p>
        <p style="font-size: 8px">/</p>
        <p style="font-size: 8px" class="totalPages"></p>
      </div>
    </div>
    `;
}
