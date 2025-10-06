import React, {useContext, useState, useEffect} from 'react';
import {BlockStack, Button, Card, InlineStack, Layout, Page, Frame} from '@shopify/polaris';
import {MaxModalContext} from '@assets/contexts/maxModalContext';
import AppNavigation from '@assets/layouts/AppLayout/AppNavigation';

export default function Home() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Frame navigation={<AppNavigation />}>
      <Page title="Home">
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              <Card>
                <InlineStack blockAlign="center" gap="200">
                  <span>App status is {enabled ? 'enabled' : 'disabled'}</span>
                  <div style={{flex: 1}} />
                  <Button
                    variant={enabled ? 'secondary' : 'primary'}
                    tone={enabled ? 'critical' : 'success'}
                    onClick={() => setEnabled(prev => !prev)}
                  >
                    {enabled ? 'Disable' : 'Enable'}
                  </Button>
                </InlineStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}
