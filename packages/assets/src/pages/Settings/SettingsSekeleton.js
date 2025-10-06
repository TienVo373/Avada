import React from 'react';
import {
  Layout,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  Card,
  BlockStack,
  InlineStack
} from '@shopify/polaris';

export function SkeletonExample() {
  return (
    <SkeletonPage fullWidth title="Settings" primaryAction>
      <Layout>
        <Layout.Section variant="oneThird">
          <Card sectioned>
            <BlockStack gap="200">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <SkeletonBodyText lines={1} />
              <InlineStack>
                <SkeletonDisplayText size="medium" />
                <SkeletonDisplayText size="medium" />
                <SkeletonDisplayText size="medium" />
                <SkeletonDisplayText size="medium" />
              </InlineStack>

              <SkeletonBodyText lines={5} />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
