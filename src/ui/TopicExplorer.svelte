<script>
  import ONSAccordion from "./../ui/ons/ONSAccordion.svelte";
  import ONSAccordionPanel from "./../ui/ons/partials/ONSAccordionPanel.svelte";
  import censusData from "./../data/simpleTopicTableCategoryData";
  import { onMount } from "svelte";
  import slugify from "slugify";
  import { selectedData } from "../model/censusdata/censusdata";

  export let selectedTopic;

  let topicIndex;

  $: {
    if (selectedTopic) {
      censusData.forEach((topic) => {
        if (slugify(topic.name).toLowerCase() == selectedTopic.toLowerCase()) {
          topicIndex = censusData.indexOf(topic);
        }
      });
    }
  }

  // !!! Temporary solution -  to be removed when we'll be able to import the DS js bundle at a component level
  onMount(() => {
    if (selectedTopic) {
      setTimeout(() => {
        document.querySelector(`#topic-${topicIndex} .ons-btn`).click();
      }, 250);
    }
  });

  function populatesSelectedData(tableName, tableCategories, selectedCategory) {
    $selectedData = {};
    $selectedData = { tableName: tableName, tableCategories: tableCategories, categorySelected: selectedCategory };
  }
</script>

<ONSAccordion showAll={false}>
  {#each censusData as topic, i}
    <ONSAccordionPanel id="topic-{i}" title={topic.name} noTopBorder>
      {#each topic.tables as tableEntry}
        <h3 class="ons-related-links__title ons-u-fs-r--b ons-u-mb-xs">{tableEntry.name}</h3>
        <ul class="ons-list ons-list--bare">
          {#each tableEntry.categories as category}
            <li class="ons-list__item">
              <a
                href="/{slugify(topic.name).toLowerCase()}/{slugify(tableEntry.name).toLowerCase()}/{slugify(
                  category.name,
                ).toLowerCase()}?location=E08000012"
                class="ons-list__link"
                on:click={() => populatesSelectedData(tableEntry.name, tableEntry.categories, category.code)}
                >{category.name}</a
              >
            </li>
          {/each}
        </ul>
      {/each}
    </ONSAccordionPanel>
  {/each}
</ONSAccordion>
