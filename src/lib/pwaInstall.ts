import { useEffect, useRef, useState } from "react";
import {
  isMobile,
  isAndroid,
  isFirefox,
  isIOS,
  isOpera,
  browserVersion,
} from "mobile-device-detect";

const platforms = {
  NATIVE: "native", // currently: Chrome, Edge mobile, Samsung internet
  FIREFOX: "firefox",
  FIREFOX_NEW: "firefox_new", // above version 79
  OPERA: "opera",
  IDEVICE: "idevice",
  OTHER: "other", // don't know, so will do nothing
};

function getPlatform() {
  let platform = platforms.OTHER;
  if (window.hasOwnProperty("BeforeInstallPromptEvent")) {
    platform = platforms.NATIVE;
  } else if (isMobile && isAndroid && isFirefox && +browserVersion >= 79) {
    platform = platforms.FIREFOX_NEW;
  } else if (isMobile && isAndroid && isFirefox) {
    platform = platforms.FIREFOX;
  } else if (isOpera && isAndroid && isMobile) {
    platform = platforms.OPERA;
  } else if (isIOS && isMobile) {
    platform = platforms.IDEVICE;
  }

  return platform;
}

export const usePwa = () => {
  const platform = getPlatform();
  const deferredprompt = useRef<any>(null);
  useEffect(() => {
    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPromptEvent
    );
    return function cleanup() {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPromptEvent
      );
    };
  }, []);

  const isInstalled =
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;

  function handleBeforeInstallPromptEvent(event) {
    event.preventDefault();
    deferredprompt.current = event;
  }

  const isSupported = () =>
    (deferredprompt.current != null && platform === platforms.NATIVE) ||
    (platform !== platforms.NATIVE && platform !== platforms.OTHER);

  function install() {
    if (deferredprompt.current != null) {
      return deferredprompt.current
        .prompt()
        .then((event) => deferredprompt.current?.userChoice)
        .then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
          } else {
          }
        })
        .catch(console.error);
    }
  }

  return { isInstalled, isSupported, install };
};
