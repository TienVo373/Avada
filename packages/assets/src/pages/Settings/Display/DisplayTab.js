import React from 'react';
import { useCallback } from 'react';
import {
  Card,
  RangeSlider,
  Text,
  InlineStack,
  BlockStack,
  Box,
  Layout,
  Checkbox
} from '@shopify/polaris';
import DesktopPositionInput from '../../../components/DesktopPositionInput/DesktopPositionInput';
import PropTypes from 'prop-types';
export default function DisplayTab({ input, setInput }) {
  const handleSliderChange = useCallback(
    key => value => {
      setInput(prev => ({
        ...prev,
        [key]: value
      }));
    },
    [setInput]
  );

  return (
    <Card>
      <BlockStack align="space-between" gap="1000">
        <Text as="h2" variant="headingMd">
          Appearance
        </Text>
        <DesktopPositionInput
          label="Desktop Position"
          value={input.position}
          onChange={newValue => setInput(prev => ({ ...prev, position: newValue }))}
          helpText="The display position of the pop on your website"
        />

        <BlockStack gap="400">
          <Checkbox
            label="Hide time ago"
            checked={!!input.hideTimeAgo}
            onChange={checked => setInput(prev => ({ ...prev, hideTimeAgo: checked }))}
          />
          <Checkbox
            label="Truncate product name"
            checked={!!input.truncateProductName}
            onChange={checked => setInput(prev => ({ ...prev, truncateProductName: checked }))}
          />
        </BlockStack>

        <Card>
          <Layout>
            <Layout.Section variant="oneFourth">
              <InlineStack align="start" gap="400">
                <InlineStack gap="600" wrap={false}>
                  <RangeSlider
                    label="Display duration"
                    min={0}
                    max={60}
                    value={input.displayDuration}
                    onChange={handleSliderChange('displayDuration')}
                    output
                    helpText="How long each pop will display on your page"
                  />
                  <Box minWidth="60px">
                    <Text as="p">{input.displayDuration} second(s)</Text>
                  </Box>
                </InlineStack>
                <InlineStack gap="600" wrap={false}>
                  <RangeSlider
                    label="Time before the first pop"
                    min={0}
                    max={60}
                    value={input.timeBeforeFirstPop}
                    onChange={handleSliderChange('timeBeforeFirstPop')}
                    output
                    helpText="How long each pop will display on your page"
                  />
                  <Box minWidth="60px">
                    <Text as="p">{input.timeBeforeFirstPop} second(s)</Text>
                  </Box>
                </InlineStack>
                <InlineStack gap="600" wrap={false}>
                  <RangeSlider
                    label="Gap time between two pops"
                    min={0}
                    max={60}
                    value={input.gapBetweenPops}
                    onChange={handleSliderChange('gapBetweenPops')}
                    output
                    helpText="How long each pop will display on your page"
                  />
                  <Box minWidth="60px">
                    <Text as="p">{input.gapBetweenPops} second(s)</Text>
                  </Box>
                </InlineStack>
                <InlineStack gap="600" wrap={false}>
                  <RangeSlider
                    label="Maximum of popups"
                    min={0}
                    max={80}
                    value={input.maxPopups}
                    onChange={handleSliderChange('maxPopups')}
                    output
                    helpText="How long each pop will display on your page"
                  />
                  <Box minWidth="60px">
                    <Text as="p">{input.maxPopups} pop(s)</Text>
                  </Box>
                </InlineStack>
              </InlineStack>
            </Layout.Section>
          </Layout>
        </Card>
      </BlockStack>
    </Card>
  );
}
DisplayTab.propTypes = {
  input: PropTypes.shape({
    hideTimeAgo: PropTypes.bool,
    truncateProductName: PropTypes.bool,
    position: PropTypes.string,
    displayDuration: PropTypes.number,
    timeBeforeFirstPop: PropTypes.number,
    gapBetweenPops: PropTypes.number,
    maxPopups: PropTypes.number
  }),
  setInput: PropTypes.func.isRequired
};
