export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    console.info('Twitter AI Blocker installed');
  });
});

