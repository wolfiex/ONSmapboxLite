<script>
  import { ethnicity, cities, checkboxData } from "./../data/test/mockDSData";
  import ONSCensusApp from "./../ui/ons/ONSCensusApp.svelte";
  import ONSAccordion from "./../ui/ons/ONSAccordion.svelte";
  import ONSAccordionPanel from "./../ui/ons/partials/ONSAccordionPanel.svelte";
  import ONSBacklink from "./../ui/ons/ONSBacklink.svelte";
  import ONSBreadcrumbs from "./../ui/ons/ONSBreadcrumbs.svelte";
  import ONSBreadcrumb from "./../ui/ons/partials/ONSBreadcrumb.svelte";
  import ONSButton from "./../ui/ons/ONSButton.svelte";
  import ONSCard from "./../ui/ons/ONSCard.svelte";
  import ONSCheckboxes from "./../ui/ons/ONSCheckboxes.svelte";
  import ONSCheckbox from "./../ui/ons/partials/ONSCheckbox.svelte";
  import ONSCollapsible from "./../ui/ons/ONSCollapsible.svelte";
  import ONSTextField from "./../ui/ons/ONSTextField.svelte";
  import ONSRadios from "./../ui/ons/ONSRadios.svelte";
  import ONSRadio from "./../ui/ons/partials/ONSRadio.svelte";
  import ONSTextArea from "./../ui/ons/ONSTextArea.svelte";
  import ONSShare from "./../ui/ons/ONSShare.svelte";
  import ONSHeader from "./../ui/ons/ONSHeader.svelte";
  import ONSSelect from "./../ui/ons/ONSSelect.svelte";
  import ONSSkipLink from "./../ui/ons/ONSSkipLink.svelte";
  import Feedback from "./../ui/Feedback.svelte";
  import ONSExternalHeaderWithDescription from "./../ui/ons/ONSExternalHeaderWithDescription.svelte";
  import DesignSystemPanel from "./../ui/DesignSystemPanel.svelte";
  import ONSAutosuggest from "./../ui/ons/ONSAutosuggest.svelte";
  import ONSShareItem from "./../ui/ons/partials/ONSShareItem.svelte";
  import ONSFacebookIcon from "./../ui/ons/svg/ONSFacebookIcon.svelte";
  import ONSTwitterIcon from "./../ui/ons/svg/ONSTwitterIcon.svelte";

  let serviceTitle = "Design System";
  let serviceDescription = "Components implemented with Svelte";
  let radioValue = "none";
  let errorExRadioValue = "none";
  let selectValue;
  let selectValueErrorEx;
  let textFieldValue = "";
  let inputErrorValue = "";
  let textAreaValue = "";
  let textAreaValueErrorEx = "";
  let selections = [];
  let errorSelection = [];
  let autosuggestData =
    "https://gist.githubusercontent.com/rmccar/c123023fa6bd1b137d7f960c3ffa1fed/raw/4dede1d6e757cf0bb836228600676c62ceb4f86c/country-of-birth.json";
  let autosuggestValue = "";
</script>

<svelte:head>
  <title>2021 Census Data Atlas Design System</title>
  <script defer src="https://cdn.ons.gov.uk/sdc/design-system/44.1.2/scripts/main.js"></script>
</svelte:head>

<ONSSkipLink />
<ONSExternalHeaderWithDescription {serviceTitle} description={serviceDescription} />
<ONSSkipLink />

<ONSCensusApp>
  <DesignSystemPanel title="Backlink" code={`<ONSBacklink href="/home"/>`}>
    <ONSBacklink href="/home" />
  </DesignSystemPanel>

  <DesignSystemPanel title="Header" code={`<ONSExternalHeaderWithDescription />`}>
    <ONSExternalHeaderWithDescription
      serviceTitle="Explore Census"
      description="Here's a place where we tell users what the Census Atlas is and what it can do for them."
    />
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Breadcrumbs"
    code={`<ONSBreadcrumbs>
  <ONSBreadcrumb href="/home">Home</ONSBreadcrumb>
  <ONSBreadcrumb href="/home/layer-1">Layer 1</ONSBreadcrumb>
</ONSBreadcrumbs>`}
  >
    <ONSBreadcrumbs>
      <ONSBreadcrumb href="/home">Home</ONSBreadcrumb>
      <ONSBreadcrumb href="/home/layer-1">Layer 1</ONSBreadcrumb>
    </ONSBreadcrumbs>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Button"
    code={`<ONSButton onClick={() => alert("Custom on click handler")}>Custom onclick handler</ONSButton>`}
  >
    <ONSButton onClick={() => alert("Custom on click handler")}>Custom onclick handler</ONSButton>
  </DesignSystemPanel>
  <DesignSystemPanel title="Secondary button" code={`<ONSButton secondary>Secondary</ONSButton>`}>
    <ONSButton secondary>Secondary</ONSButton>
  </DesignSystemPanel>
  <DesignSystemPanel title="Small button" code={`<ONSButton small>Small</ONSButton>`}>
    <ONSButton small>Small</ONSButton>
  </DesignSystemPanel>
  <DesignSystemPanel title="Secondary small button" code={`<ONSButton secondary small>Secondary small</ONSButton>`}>
    <ONSButton secondary small>Secondary small</ONSButton>
  </DesignSystemPanel>
  <DesignSystemPanel title="Disabled button" code={`<ONSButton disabled>Disabled</ONSButton>`}>
    <ONSButton disabled>Disabled</ONSButton>
  </DesignSystemPanel>
  <DesignSystemPanel title="Card" code={`<ONSCard title="ONS Card" href="/home">Card</ONSCard>`}>
    <ONSCard title="ONS Card" href="/home">Card</ONSCard>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Checkboxes"
    code={`<ONSCheckboxes
        name="devices"
        title="What devices do you own?"
        checkboxesLabel="Select all that apply"
        id="1-fieldset"
        legendIsQuestionTitle
        renderError={false}
      >
        {#each checkboxData as option}
          <ONSCheckbox
            id={'error-checkbox-option-\${option.id}'}
            value={option.value}
            labelText={option.label}
            bind:bindGroup={selections}
            onChange={(selections) => console.log("User selections: ", selections.join(", "))}
          />
        {/each}
      </ONSCheckboxes>
      <p>Checkboxes: <strong>{selections}</strong></p>`}
  >
    <ONSCheckboxes
      name="devices"
      title="What devices do you own?"
      checkboxesLabel="Select all that apply"
      id="1-fieldset"
      legendIsQuestionTitle
      renderError={false}
    >
      {#each checkboxData as option}
        <ONSCheckbox
          id={`error-checkbox-option-${option.id}`}
          value={option.value}
          labelText={option.label}
          bind:bindGroup={selections}
          onChange={(selections) => console.log("User selections: ", selections.join(", "))}
        />
      {/each}
    </ONSCheckboxes>
    <br />
    <p>Checkboxes: <strong>{selections}</strong></p>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Checkboxes - error message"
    code={`<ONSCheckboxes
        name="devices-error"
        title="What devices do you own?"
        checkboxesLabel="Select all that apply"
        id="2-fieldset"
        legendIsQuestionTitle
        renderError
      >
        {#each checkboxData as option}
          <ONSCheckbox
            id={'error-checkbox-option-\${checkboxData.indexOf(option)}'}
            value={option.value}
            labelText={option.label}
            bind:bindGroup={errorSelection}
            onChange={(errorSelection) => console.log("User selections: ", errorSelection.join(", "))}
          />
        {/each}
      </ONSCheckboxes>`}
  >
    <ONSCheckboxes
      name="devices-error"
      title="What devices do you own?"
      checkboxesLabel="Select all that apply"
      id="2-fieldset"
      legendIsQuestionTitle
      renderError
    >
      {#each checkboxData as option}
        <ONSCheckbox
          id={`error-checkbox-option-${checkboxData.indexOf(option)}`}
          value={option.value}
          labelText={option.label}
          bind:bindGroup={errorSelection}
          onChange={(errorSelection) => console.log("User selections: ", errorSelection.join(", "))}
        />
      {/each}
    </ONSCheckboxes>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Collapsible"
    code={`<ONSCollapsible title="Collapsible">
  <span>here is the collapsible content</span>
</ONSCollapsible>`}
  >
    <ONSCollapsible title="Collapsible">
      <span>here is the collapsible content</span>
    </ONSCollapsible>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Input"
    code={`<ONSTextField
      id="text-field-1"
      type="text"
      bind:textFieldValue
      labelText="Text field"
      renderError={false}
      accessiblePlaceholder
      onInput={(textFieldValue) => console.log("Input user value: ", textFieldValue)}
      onChange={(textFieldValue)=>console.log("Displays what user is typing every time they hit the return key: ",textFieldValue)}
    />
    <p>You are typing: <strong>{textFieldValue}</strong></p>`}
  >
    <ONSTextField
      id="text-field-1"
      type="text"
      bind:textFieldValue
      labelText="Text field"
      renderError={false}
      accessiblePlaceholder
      onInput={(textFieldValue) => console.log("Input user value: ", textFieldValue)}
      onChange={(textFieldValue) =>
        console.log("Displays what user is typing every time they hit the return key: ", textFieldValue)}
    />
    <br />
    <p>You are typing: <strong>{textFieldValue}</strong></p>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Input-error message"
    code={`<ONSTextField
      id="text-field-2"
      type="text"
      bind:textFieldValue={inputErrorValue}
      labelText="Text field"
      renderError
      onInput={(inputErrorValue) => console.log("Input user value: ", inputErrorValue)}
      onChange={(textFieldValue)=>console.log("Displays what user is typing every time they hit the return key: ",textFieldValue)}
    />`}
  >
    <ONSTextField
      id="text-field-2"
      type="text"
      bind:textFieldValue={inputErrorValue}
      labelText="Text field"
      renderError
      onInput={(inputErrorValue) => console.log("Input user value: ", inputErrorValue)}
      onChange={(textFieldValue) =>
        console.log("Displays what user is typing every time they hit the return key: ", textFieldValue)}
    />
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Autosuggest"
    code={`<ONSAutosuggest
      id="country-of-birth"
      labelText="Current name of country"
      hint="Enter your own answer or select from suggestions"
      {autosuggestData}
      bind:autosuggestValue
    />
    <p>You are looking for: <strong>{autosuggestValue}</strong></p>`}
  >
    <ONSAutosuggest
      id="country-of-birth"
      labelText="Current name of country"
      hint="Enter your own answer or select from suggestions"
      {autosuggestData}
      bind:autosuggestValue
    />
    <br />
    <p>You are looking for: <strong>{autosuggestValue}</strong></p>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Select"
    code={`<ONSSelect
      bind:selectValue
      label="Select city"
      name="select"
      id="1-select-city"
      options={cities}
      renderError={false}
      onClick={(selectValue)=>console.log("Displays current selection: ",selectValue)}
    />
    <p>You have selected: <strong>{selectValue}</strong></p>`}
  >
    <ONSSelect
      bind:selectValue
      label="Select city"
      name="select"
      id="1-select-city"
      options={cities}
      renderError={false}
      onClick={(selectValue) => console.log("Displays current selection: ", selectValue)}
    />
    <br />
    <p>You have selected: <strong>{selectValue}</strong></p>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Select - error message"
    code={`<ONSSelect
    bind:selectValue={selectValueErrorEx}
      label="Select city"
      name="select"
      id="2-select-city"
      options={cities}
      renderError
      onClick={(selectValue)=>console.log("Displays current selection: ",selectValue)}
    />`}
  >
    <ONSSelect
      bind:selectValue={selectValueErrorEx}
      label="Select city"
      name="select"
      id="2-select-city"
      options={cities}
      renderError
      onClick={(selectValueErrorEx) => console.log("Displays current selection: ", selectValueErrorEx)}
    />
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Text area"
    code={`<ONSTextArea
      id="text-area-1"
      labelText="Text area"
      hint="this is a hint for text area"
      bind:textAreaValue
      renderError={false}
      placeholderText="enter your placeholder text..."
      onChange={(textAreaValue) =>
        console.log("Displays what user is typing every time they click outside of the text area box: ", textAreaValue)}
      onInput={(textAreaValue) => console.log("Text area user value: ", textAreaValue)}
    />`}
  >
    <ONSTextArea
      id="text-area-1"
      labelText="Text area"
      hint="this is a hint for text area"
      bind:textAreaValue
      renderError={false}
      placeholderText="enter your placeholder text..."
      onChange={(textAreaValue) =>
        console.log("Displays what user is typing every time they click outside of the text area box: ", textAreaValue)}
      onInput={(textAreaValue) => console.log("Text area user value: ", textAreaValue)}
    />
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Text area - error message"
    code={`<ONSTextArea
      id="text-area-2"
      labelText="Text area"
      hint="this is a hint for text area"
      bind:textAreaValue={textAreaValueErrorEx}
      renderError
      placeholderText="enter your placeholder text..."
      onChange={(textAreaValue) =>
        console.log("Displays what user is typing every time they click outside of the text area box: ", textAreaValue)}
      onInput={(textAreaValue) => console.log("Text area user value: ", textAreaValue)}
    />`}
  >
    <ONSTextArea
      id="text-area-2"
      labelText="Text area"
      hint="this is a hint for text area"
      bind:textAreaValue={textAreaValueErrorEx}
      renderError
      placeholderText="enter your placeholder text..."
      onChange={(textAreaValue) =>
        console.log("Displays what user is typing every time they click outside of the text area box: ", textAreaValue)}
      onInput={(textAreaValue) => console.log("Text area user value: ", textAreaValue)}
    />
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Radios"
    code={`<ONSRadios renderError={false} name="ethnicity">
  {#each ethnicity as option}
    <ONSRadio  bind:radioValue  id={'radio-button-id-\${option.id}'} value={option.value} onChange={(radioValue) => console.log('ethnicity changed to', radioValue)}>{option.label}</ONSRadio>
  {/each}
</ONSRadios>

<p>You have selected: {radioValue}</p>`}
  >
    <ONSRadios renderError={false} name="ethnicity">
      {#each ethnicity as option}
        <ONSRadio
          bind:radioValue
          id={`radio-button-id-${option.id}`}
          value={option.value}
          onChange={(radioValue) => console.log("ethnicity ID changed to", radioValue)}>{option.label}</ONSRadio
        >
      {/each}
    </ONSRadios>
    <br />
    <p>You have selected: <strong>{radioValue}</strong></p>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Radios - error message"
    code={`<ONSRadios renderError name="err-ethnicity-ex">
      {#each ethnicity as option}
        <ONSRadio
          bind:radioValue={errorExRadioValue}
          id={'error-radio-button-id-\${ethnicity.indexOf(option)}'}
          value={option.value}
          onChange={(errorExRadioValue) => console.log("ethnicity changed to", errorExRadioValue)}>{option.label}</ONSRadio
        >
      {/each}
    </ONSRadios>`}
  >
    <ONSRadios renderError name="err-ethnicity-ex">
      {#each ethnicity as option}
        <ONSRadio
          bind:radioValue={errorExRadioValue}
          id={`error-radio-button-id-${ethnicity.indexOf(option)}`}
          value={option.value}
          onChange={(errorExRadioValue) => console.log("ethnicity changed to", errorExRadioValue)}
          >{option.label}</ONSRadio
        >
      {/each}
    </ONSRadios>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Accordion"
    code={` <ONSAccordion showAll={false}>
    <ONSAccordionPanel id="panel-1" title="Total retail turnover"
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio aliquid facere vel facilis in necessitatibus
      magni sequi unde, ad rerum praesentium, deserunt quo saepe dolore, accusantium fuga quia tenetur sed.</ONSAccordionPanel
    >
    <ONSAccordionPanel id="panel-2" title="Food sales"
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio aliquid facere vel facilis in necessitatibus
      magni sequi unde, ad rerum praesentium, deserunt quo saepe dolore, accusantium fuga quia tenetur sed.</ONSAccordionPanel
    >
  </ONSAccordion>/>`}
  >
    <ONSAccordion showAll>
      <ONSAccordionPanel id="panel-1" title="Total retail turnover"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio aliquid facere vel facilis in
        necessitatibus magni sequi unde, ad rerum praesentium, deserunt quo saepe dolore, accusantium fuga quia tenetur
        sed.</ONSAccordionPanel
      >
      <ONSAccordionPanel id="panel-2" title="Food sales"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio aliquid facere vel facilis in
        necessitatibus magni sequi unde, ad rerum praesentium, deserunt quo saepe dolore, accusantium fuga quia tenetur
        sed.</ONSAccordionPanel
      >
    </ONSAccordion>
  </DesignSystemPanel>

  <DesignSystemPanel
    title="Share"
    code={`<ONSShare pageURL={location.href} pageTitle={document.title}>
      <ONSShareItem facebook shareText="Facebook"><ONSFacebookIcon /></ONSShareItem>
      <ONSShareItem twitter shareText="Twitter"><ONSTwitterIcon /></ONSShareItem>
    </ONSShare>`}
  >
    <ONSShare pageURL={location.href} pageTitle={document.title}>
      <ONSShareItem facebook shareText="Facebook"><ONSFacebookIcon /></ONSShareItem>
      <ONSShareItem twitter shareText="Twitter"><ONSTwitterIcon /></ONSShareItem>
    </ONSShare>
  </DesignSystemPanel>

  <DesignSystemPanel title="Feedback" code={`<Feedback />`}>
    <Feedback />
  </DesignSystemPanel>
</ONSCensusApp>

<style lang="scss">
  @import "./../../node_modules/@ons/design-system/scss/vars/_index.scss";

  h2 {
    margin-top: 32px;
  }
</style>
