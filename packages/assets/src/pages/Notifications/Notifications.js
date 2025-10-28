import {useState, useCallback} from 'react';
import React from 'react';
import {Card, ResourceList, ResourceItem, Page, Text, InlineStack, Layout} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import usePaginate from '../../hooks/api/usePaginate';
/**
 *
 * @returns {JSX.Element}
 */
export default function Notifications() {
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [selectedItems, setSelectedItems] = useState([]);
  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };
  const {loading, prevPage, nextPage, pageInfo, data: items, setData: setItems} = usePaginate({
    url: '/notifications',
    defaultLimit: 10,
    defaultSort: 'timestamp:desc'
  });
  const handleSortChange = useCallback(
    selected => {
      setSortValue(selected);
      const sorted = [...items].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);

        if (selected === 'DATE_MODIFIED_DESC') {
          return dateB - dateA;
        }
        return dateA - dateB;
      });
      setItems(sorted);
    },
    [items, setItems]
  );

  return (
    <Page title="Notifications" subtitle="List of sale notifications from Shopify ">
      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={resourceName}
              items={items || []}
              renderItem={item => renderItem(item)}
              loading={loading}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              selectable
              sortValue={sortValue}
              sortOptions={[
                {label: 'Newest date', value: 'DATE_MODIFIED_DESC'},
                {label: 'Oldest date', value: 'DATE_MODIFIED_ASC'}
              ]}
              onSortChange={handleSortChange}
              pagination={{
                hasNext: !!pageInfo?.hasNext,
                hasPrevious: !!pageInfo?.hasPre,
                onNext: nextPage,
                onPrevious: prevPage
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
  function renderItem(item) {
    return (
      <ResourceItem id={item.id}>
        <InlineStack align="space-between">
          <NotificationPopup
            firstName={item.firstName}
            city={item.city}
            country={item.country}
            productName={item.productName}
            productImage={item.productImage}
            timestamp={item.timestamp}
            settings={item.settings}
          ></NotificationPopup>
          <Text>{new Date(item.timestamp).toLocaleString()}</Text>
        </InlineStack>
      </ResourceItem>
    );
  }
}
