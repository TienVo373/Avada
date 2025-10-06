import React, {useState, useCallback} from 'react';
import {Page, InlineStack, Tabs, Layout} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import DisplayTab from './Display/DisplayTab';
import TriggerTab from './Trigger/TriggerTab';
import defaultSetting from '../../../../functions/src/const/defaultSetting';
import useFetchApi from '../../hooks/api/useFetchApi';
import useEditApi from '../../hooks/api/useEditApi';
import {SkeletonExample} from './SettingsSekeleton';
export default function Settings() {
  const {loading, data: input, setData: setInput} = useFetchApi({
    url: '/settings',
    defaultData: defaultSetting
  });

  const [tab, setTab] = useState(0);
  const tabs = [
    {id: 'display-tab', content: 'Display', panelID: 'display-panel'},
    {id: 'trigger-tab', content: 'Trigger', panelID: 'trigger-panel'}
  ];

  const handleTabChange = useCallback(selectedTabIndex => setTab(selectedTabIndex), []);
  const {editing, handleEdit} = useEditApi({
    url: '/settings',
    successMsg: 'Settings saved successfully',
    errorMsg: 'Failed to save settings'
  });
  const handleSave = useCallback(async () => {
    await handleEdit(input);
  }, [input, handleEdit]);
  return loading ? (
    <SkeletonExample />
  ) : (
    <Page
      fullWidth={true}
      title="Settings"
      subtitle="Decide your settings here"
      primaryAction={{
        content: 'Save',
        tone: 'success',
        variant: 'primary',
        loading: editing,
        onAction: handleSave
      }}
    >
      <>
        <InlineStack>
          <Layout.Section variant="oneThird">
            <NotificationPopup settings={input} />
          </Layout.Section>
          <Layout.Section>
            <Tabs tabs={tabs} tab={tab} onSelect={handleTabChange} />
            {tab === 0 && <DisplayTab input={input} setInput={setInput} />}
            {tab === 1 && <TriggerTab input={input} setInput={setInput} />}
          </Layout.Section>
        </InlineStack>
      </>
    </Page>
  );
}
