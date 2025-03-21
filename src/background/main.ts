// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

const injectedTabs = new Set()

browser.action.onClicked.addListener(async (tab) => {
  if (!tab.id)
    return

  try {
    const [result] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => !!document.querySelector('#qspect'),
    })

    const isContentScriptPresent = result.result

    if (injectedTabs.has(tab.id) && isContentScriptPresent) {
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const root = document.querySelector('#qspect')
          if (root) {
            root.remove()
          }
        },
      })

      await browser.action.setBadgeText({
        tabId: tab.id,
        text: '',
      })

      injectedTabs.delete(tab.id)

      // eslint-disable-next-line no-console
      console.log('Content script removed successfully')
    }
    else {
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['dist/contentScripts/index.global.js'],
        })

        await browser.action.setBadgeText({
          tabId: tab.id,
          text: 'ON',
        })

        await browser.action.setBadgeBackgroundColor({
          tabId: tab.id,
          color: 'green',
        })

        injectedTabs.add(tab.id)

        // eslint-disable-next-line no-console
        console.log('Content script injected successfully')
      }
      catch (injectionError) {
        console.error('Failed to inject content script:', injectionError)
        throw injectionError
      }
    }
  }
  catch (error) {
    console.error('Failed to toggle content script:', error)
  }
})

browser.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId)
})

// // remove or turn this off if you don't use side panel
// const USE_SIDE_PANEL = false

// // to toggle the sidepanel with the action button in chromium:
// if (USE_SIDE_PANEL) {
//   // @ts-expect-error missing types
//   browser.sidePanel
//     .setPanelBehavior({ openPanelOnActionClick: true })
//     .catch((error: unknown) => console.error(error))
// }

// browser.runtime.onInstalled.addListener((): void => {
//   // eslint-disable-next-line no-console
//   console.log('Extension installed')
// })

// let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async ({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }

//   let tab: Tabs.Tab

//   try {
//     tab = await browser.tabs.get(previousTabId)
//     previousTabId = tabId
//   }
//   catch {
//     return
//   }

//   // eslint-disable-next-line no-console
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
// })

// onMessage('get-current-tab', async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.title,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })
