import React, {useCallback} from 'react';
import {Card, TextField, Select, Form, FormLayout, Box, BlockStack} from '@shopify/polaris';
import PropTypes from 'prop-types';

export default function TriggerTab({input, setInput}) {
  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'}
  ];

  const handleSelectChange = useCallback(value => setInput(prev => ({...prev, allowShow: value})), [
    setInput
  ]);

  const handleIncludedUrlsChange = useCallback(
    value => setInput(prev => ({...prev, includedUrls: value})),
    [setInput]
  );

  const handleExcludedUrlsChange = useCallback(
    value => setInput(prev => ({...prev, excludedUrls: value})),
    [setInput]
  );

  return (
    <Card>
      <BlockStack>
        <Box>
          <Select
            label="Page Restriction"
            options={options}
            onChange={handleSelectChange}
            value={input.allowShow}
          />

          <Form noValidate>
            <FormLayout>
              {input.allowShow === 'specific' && (
                <TextField
                  value={input.includedUrls}
                  onChange={handleIncludedUrlsChange}
                  label="Included Pages"
                  type="url"
                  autoComplete="off"
                  helpText="Page URLs where the pop-up should be shown (separated by new lines)"
                  multiline={4}
                />
              )}

              <TextField
                value={input.excludedUrls}
                onChange={handleExcludedUrlsChange}
                label="Excluded Pages"
                type="url"
                autoComplete="off"
                helpText="Page URLs NOT to show the pop-up (separated by new lines)"
                multiline={4}
              />
            </FormLayout>
          </Form>
        </Box>
      </BlockStack>
    </Card>
  );
}

TriggerTab.propTypes = {
  input: PropTypes.shape({
    allowShow: PropTypes.string,
    includedUrls: PropTypes.string,
    excludedUrls: PropTypes.string
  }),
  setInput: PropTypes.func.isRequired
};
