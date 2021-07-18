import { useContext, createContext, useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import { useDB } from "./Database";
import { useLayout } from "./Layout";

const Context = createContext({
  tabs: [],
  activeTab: {},
  switchTab: () => {},
  closeTab: () => {},
});

export const useTabManager = () => useContext(Context);

const TabManager = ({ children }) => {
  const { db } = useDB();
  const { getWorkspace } = useLayout();
  const tabRef = useRef();

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const updateActiveTab = (activeTab) => {
    tabRef.current = activeTab;
    setActiveTab(activeTab);
  };

  // handle redirection when active tab changes
  useEffect(() => {
    console.log("CheckinglocATION", location);
    if (location !== "/thoth") setLocation("/thoth");
  }, [activeTab]);

  // handle setting up autosave

  // Suscribe to changes in the database for active tab, and all tabs
  useEffect(() => {
    if (!db) return;

    (async () => {
      await db.tabs
        .findOne({ selector: { active: true } })
        .$.subscribe((result) => {
          if (!result) return;

          setActiveTab(result.toJSON());
        });

      await db.tabs.find().$.subscribe((result) => {
        if (!result || result.length === 0) return;

        setTabs(result.map((tab) => tab.toJSON()));
      });
    })();
  }, [db]);

  const openTab = async ({
    workspace = "default",
    name = "My Spell",
    spellId,
  }) => {
    const newTab = {
      layoutJson: getWorkspace(workspace),
      name,
      id: uuidv4(),
      spell: spellId,
      type: "spell",
      active: true,
    };

    console.log("new tab", newTab);

    await db.tabs.insert(newTab);
  };

  const closeTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    if (!tab) return;
    await tab.remove();
  };

  const switchTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    await tab.atomicPatch({ active: true });

    updateActiveTab(tab.toJSON());
  };

  const publicInterface = {
    tabs,
    activeTab,
    openTab,
    switchTab,
    closeTab,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default TabManager;
