export const apiHeader = {
  click: {
    key: process.env.CLICK_HEADER_KEY ?? "",
    value: process.env.CLICK_HEADER_VALUE ?? "",
  },
  survey: {
    key: 'X-Survey-Header',
    value: "Y2xpY2s=",
  }
}