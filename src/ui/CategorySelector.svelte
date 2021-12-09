<script>
  export let categories = [
    {
      id: "QS302EW001",
      name: "Very good health",
    },
    {
      id: "QS302EW002",
      name: "Good health",
    },
    {
      id: "QS302EW003",
      name: "Fair health",
    },
    {
      id: "QS302EW004",
      name: "Bad health",
    },
    {
      id: "QS302EW005",
      name: "Very bad health",
    },
  ];

  export let selectedCode = "QS302EW002";
  export let selectedCatIndex = 0;
  categories.forEach((category, index) => {
    if (category.id == selectedCode) {
      selectedCatIndex = index;
    }
  });
</script>

<div class="category-selector ons-grid--flex ons-grid--vertical-center">
  <div class="ons-grid__col ons-col-4@m selector-col ">
    <div class="ons-pl-grid-col ons-grid--flex ons-grid__col--flex" style="justify-content:left">
      <span>&#60;&#160;</span>
      {#if selectedCatIndex > 0}
        <p class="category-selector__button" href="#" on:click={() => selectedCatIndex--}>
          {categories[selectedCatIndex - 1].name}
        </p>
      {:else}
        <p class="category-selector__button" href="#" on:click={() => (selectedCatIndex = categories.length - 1)}>
          {categories[categories.length - 1].name}
        </p>
      {/if}
    </div>
  </div>
  <div class="ons-grid__col ons-col-4@m selector-col ons-grid--flex">
    <div class="ons-pl-grid-col">
      <p>{categories[selectedCatIndex].name}</p>
    </div>
  </div>
  <div class="ons-grid__col ons-col-4@m selector-col">
    <div class="ons-pl-grid-col ons-grid--flex" style="justify-content:right">
      {#if selectedCatIndex < categories.length - 1}
        <p class="category-selector__button category-selector__button__left" on:click={() => selectedCatIndex++}>
          {categories[selectedCatIndex + 1].name}
        </p>
      {:else}
        <p class="category-selector__button category-selector__button__left" on:click={() => (selectedCatIndex = 0)}>
          {categories[0].name}
        </p>
      {/if}
      <span>&#160;&#62;</span>
    </div>
  </div>
</div>

<style>
  .category-selector {
    background-color: #003c57;
    color: #fff;
    padding: 10px 15px 10px;
  }
  .category-selector__button {
    color: #fff;
    font-size: 1rem;
    font-weight: normal;
  }

  .category-selector__button__left {
    text-align: right;
  }
  @media (max-width: 400px) {
    .category-selector__button,
    span {
      font-size: 0.8em;
    }
  }
  .category-selector__button {
    text-decoration: underline;
    text-underline-position: unset;
  }
  .selector-col {
    max-width: 33.33333%;
    width: 33.33333%;
    padding-left: 0;
  }
  p {
    text-align: center;
    margin-bottom: 0;
    font-size: 1.3em;
    font-weight: bold;
  }
  .ons-grid--flex {
    flex-wrap: nowrap;
    align-items: center;
  }

  @media (max-width: 400px) {
    p {
      font-size: 1em;
    }
  }
</style>
