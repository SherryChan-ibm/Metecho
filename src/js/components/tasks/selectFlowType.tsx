import Radio from '@salesforce/design-system-react/components/radio-group/radio';
import Tooltip from '@salesforce/design-system-react/components/tooltip';
import i18n from 'i18next';
import React, { useState } from 'react';

import { ORG_TYPES, OrgTypes } from '@/utils/constants';

const SelectFlowType = ({
  isDisabled,
  editing,
  handleSelect,
}: {
  isDisabled?: boolean;
  editing?: boolean;
  handleSelect: (option: OrgTypes) => void;
}) => {
  // if editing task, check if there is a flow_type already selected, else use Dev as default
  const defaultFlowType = editing ? '' : ORG_TYPES.DEV;
  const [flowSelected, setFlowSelected] = useState<string>(defaultFlowType);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value as OrgTypes;
    setFlowSelected(selected);
    handleSelect(selected);
  };

  const flowTypes = [
    {
      type: ORG_TYPES.DEV,
      description: i18n.t('set up for package development'),
    },
    {
      type: ORG_TYPES.QA,
      description: i18n.t('use as a testing environment'),
    },
    {
      type: ORG_TYPES.BETA,
      description: i18n.t('what the cool kids want'),
    },
    {
      type: ORG_TYPES.RELEASE,
      description: i18n.t('ready for production'),
    },
  ];
  const helpText = isDisabled ? (
    <div>{i18n.t('This is disabled because there is a Scratch Org')}</div>
  ) : (
    flowTypes.map(({ type, description }) => (
      <div key={type}>
        <b>{type} -</b> {description}
      </div>
    ))
  );
  return (
    <fieldset className="slds-m-top--medium">
      <legend className="slds-form-element__legend slds-form-element__label">
        <span className="slds-p-right_xx-small">{i18n.t('Org Type')}</span>
        {editing && (
          <Tooltip
            content={helpText}
            position="overflowBoundaryElement"
            align="top left"
            dialogClassName="modal-tooltip"
          />
        )}
      </legend>
      <div className="slds-form-element__control">
        {flowTypes.map(({ type, description }) => {
          const label = editing ? type : `${type} - ${description}`;
          return (
            <Radio
              key={type}
              id={type}
              labels={{ label }}
              value={type}
              checked={Boolean(type === flowSelected)}
              variant="base"
              name="type"
              onChange={handleChange}
              disabled={isDisabled}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export default SelectFlowType;
