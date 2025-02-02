import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";

import { Navigation } from "screens/Navigation";
import withTranslation from "hocs/withTranslation";
// import { useInitializeAppDemo } from "hooks";
import { appSelectors, store } from "@redux";
import i18n from "./i18n";

import * as SplashScreen from "expo-splash-screen";
import { useInitializeApp } from "hooks";
import { DatabaseProvider } from "src/database/DatabaseProvider";


// keeps the splash screen visible while app fetch resources
// SplashScreen.preventAutoHideAsync();

function AppWithProvider({ children }) {
  // useOrientationLock();

  const lang = useSelector(appSelectors.selectAppLang);
  useInitializeApp(lang);
  // useInitializeAppDemo(lang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return children;
}

export default withTranslation(function RootComponent() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppWithProvider>
          <DatabaseProvider>
            <Navigation />
          </DatabaseProvider>
        </AppWithProvider>
      </GestureHandlerRootView>
    </Provider>
  );
});


if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  const originalWarn = console.error;
  // eslint-disable-next-line no-console
  console.error = (...args) => {
    // Ensure args[0] exists and is a string before calling includes
    if (
      typeof args[0] === 'string' &&
      args[0].includes(
        "Support for defaultProps will be removed from function components in a future major release."
      )
    ) {
      return;
    }
    originalWarn(...args);
  };
}