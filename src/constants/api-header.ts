export const apiHeader = {
  click: {
    key: process.env.CLICK_HEADER_KEY ?? "X-Click-Header",
    value: process.env.CLICK_HEADER_VALUE ?? "test",
  },
  survey: {
    key: 'X-Survey-Header',
    value: "Y2xpY2s=",
  }
}